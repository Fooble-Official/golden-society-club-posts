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

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 2000;
const CONTAINER_POLL_TIMEOUT_MS = 60000;
const CONTAINER_POLL_INTERVAL_MS = 3000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jsDelivrUrl(relPath) {
  const encoded = relPath.split('/').map(encodeURIComponent).join('/');
  return `https://cdn.jsdelivr.net/gh/${REPO}@${BRANCH}/${encoded}`;
}

// Retries transient failures (network errors, 5xx) with backoff. Does NOT
// retry on a clean 4xx Graph API error response — those are real problems
// (bad token, bad param) that a retry won't fix, and retrying them could
// duplicate side effects (e.g. re-creating media containers).
async function graphPost(pathSeg, params) {
  const url = `${GRAPH_BASE}/${pathSeg}`;
  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const body = new URLSearchParams({ ...params, access_token: TOKEN });
      const res = await fetch(url, { method: 'POST', body });
      if (res.status >= 500 && attempt < MAX_RETRIES) {
        lastErr = new Error(`Graph API ${res.status} on ${pathSeg}`);
        await sleep(RETRY_BASE_MS * attempt);
        continue;
      }
      const json = await res.json();
      if (json.error) {
        throw new Error(`Graph API error on ${pathSeg}: ${JSON.stringify(json.error)}`);
      }
      return json;
    } catch (err) {
      lastErr = err;
      // network-level failure (fetch threw) — safe to retry
      if (err.message && err.message.startsWith('Graph API error')) throw err;
      if (attempt < MAX_RETRIES) await sleep(RETRY_BASE_MS * attempt);
    }
  }
  throw lastErr;
}

async function graphGet(pathSeg, params) {
  const url = `${GRAPH_BASE}/${pathSeg}?${new URLSearchParams({ ...params, access_token: TOKEN })}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(`Graph API error on ${pathSeg}: ${JSON.stringify(json.error)}`);
  return json;
}

// Instagram processes each media container asynchronously. Publishing before
// a container reaches FINISHED is a common source of flaky failures, so poll
// its status_code first instead of assuming it's ready immediately.
async function waitUntilFinished(containerId) {
  const deadline = Date.now() + CONTAINER_POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const status = await graphGet(containerId, { fields: 'status_code' });
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR') {
      throw new Error(`Container ${containerId} failed processing (status ERROR).`);
    }
    await sleep(CONTAINER_POLL_INTERVAL_MS);
  }
  throw new Error(`Container ${containerId} did not finish processing within timeout.`);
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

  // Idempotency guard: if we already published this exact order today (e.g.
  // a manual re-trigger on top of the scheduled run), don't publish twice.
  // The workflow's concurrency group prevents two runs overlapping, but this
  // catches the case of two non-overlapping runs on the same calendar day.
  const today = new Date().toISOString().slice(0, 10);
  if (state.last_published_order === state.next_order - 1 &&
      state.last_published_at && state.last_published_at.slice(0, 10) === today) {
    console.log(`Order ${state.last_published_order} was already published today (${today}). Skipping to avoid a duplicate post.`);
    return;
  }

  const folder = path.join(POSTS_DIR, entry.folder);
  const post = JSON.parse(fs.readFileSync(path.join(folder, 'post.json'), 'utf8'));
  const caption = fs.readFileSync(path.join(folder, 'caption.txt'), 'utf8');

  console.log(`Day ${post.order} of 328 — publishing order ${post.order}: "${post.title}" (${post.slide_count} slides)`);

  const imageUrls = post.slides.map(s => jsDelivrUrl(`${entry.folder}/${s.file}`));
  console.log('Slide URLs:', imageUrls);

  if (DRY_RUN) {
    console.log('DRY_RUN set — not calling the Graph API, not advancing state.json.');
    return;
  }

  // Step 1: create a child media container per image (is_carousel_item),
  // then wait for each to finish processing before moving on.
  const childIds = [];
  for (const url of imageUrls) {
    const child = await graphPost(IG_USER_ID + '/media', {
      image_url: url,
      is_carousel_item: 'true',
    });
    await waitUntilFinished(child.id);
    childIds.push(child.id);
  }

  // Step 2: create the carousel container, then wait for it too
  const carousel = await graphPost(IG_USER_ID + '/media', {
    media_type: 'CAROUSEL',
    children: childIds.join(','),
    caption,
  });
  await waitUntilFinished(carousel.id);

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
