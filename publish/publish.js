#!/usr/bin/env node
/* Golden Society — daily Instagram carousel publisher.
 * Reads state.json for the next order to publish, builds a carousel from
 * that post's slide images (served via jsDelivr from this same repo),
 * creates the carousel via the Instagram Graph API, publishes it, then
 * advances state.json for the next run.
 *
 * Required env vars (set as GitHub Actions secrets):
 *   IG_ACCESS_TOKEN        - System User access token
 *   IG_BUSINESS_ACCOUNT_ID - Instagram Business Account ID
 *
 * Optional:
 *   DRY_RUN=1  - build the carousel payload and log it, but don't call the
 *                publish endpoints and don't advance state.json
 */
const fs = require('fs');
const path = require('path');

const GRAPH_VERSION = 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;
const REPO = 'Fooble-Official/golden-society-club-posts';
const BRANCH = 'main';
const STATE_PATH = path.join(__dirname, '..', 'state.json');
const POSTS_DIR = path.join(__dirname, '..');

const TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_BUSINESS_ACCOUNT_ID;
const DRY_RUN = process.env.DRY_RUN === '1';

function jsDelivrUrl(relPath) {
  const encoded = relPath.split('/').map(encodeURIComponent).join('/');
  return `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/${encoded}`;
}

async function graphPost(pathSeg, params) {
  const url = `${GRAPH_BASE}/${pathSeg}`;
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const res = await fetch(url, { method: 'POST', body });
  const json = await res.json();
  if (json.error) {
    throw new Error(`Graph API error on ${pathSeg}: ${JSON.stringify(json.error)}`);
  }
  return json;
}

async function main() {
  if (!TOKEN || !IG_USER_ID) {
    throw new Error('Missing IG_ACCESS_TOKEN or IG_BUSINESS_ACCOUNT_ID env vars.');
  }

  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  const index = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, 'index.json'), 'utf8'));

  const entry = index.find(r => r.order === state.next_order);
  if (!entry) {
    console.log(`No post found for order ${state.next_order}. Nothing to publish (series complete?).`);
    return;
  }

  const folder = path.join(POSTS_DIR, entry.folder);
  const post = JSON.parse(fs.readFileSync(path.join(folder, 'post.json'), 'utf8'));
  const caption = fs.readFileSync(path.join(folder, 'caption.txt'), 'utf8');

  console.log(`Publishing order ${post.order}: "${post.title}" (${post.slide_count} slides)`);

  const imageUrls = post.slides.map(s => jsDelivrUrl(`${entry.folder}/${s.file}`));
  console.log('Slide URLs:', imageUrls);

  if (DRY_RUN) {
    console.log('DRY_RUN set — not calling the Graph API, not advancing state.json.');
    return;
  }

  // Step 1: create a child media container per image (is_carousel_item)
  const childIds = [];
  for (const url of imageUrls) {
    const child = await graphPost(IG_USER_ID + '/media', {
      image_url: url,
      is_carousel_item: 'true',
    });
    childIds.push(child.id);
  }

  // Step 2: create the carousel container
  const carousel = await graphPost(IG_USER_ID + '/media', {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
  });

  // Step 3: publish it
  const published = await graphPost(IG_USER_ID + '/media_publish', {
    creation_id: carousel.id,
  });

  console.log('Published:', published);

  // advance state for next run
  state.next_order = post.order + 1;
  state.last_published_order = post.order;
  state.last_published_at = new Date().toISOString();
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  console.log(`Advanced state.json -> next_order ${state.next_order}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
