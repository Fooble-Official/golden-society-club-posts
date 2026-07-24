#!/usr/bin/env node
/* Golden Society — daily Instagram carousel publisher.
 * Reads state.json for the next order to publish, builds a carousel from
 * that post's slide images (served via jsDelivr from this same repo),
 * creates the carousel via the Instagram API, publishes it, then advances
 * state.json for the next run.
 *
 * Uses the Instagram API with Instagram Login (graph.instagram.com), not
 * the classic Facebook Page-linked Graph API — this account's token is an
 * "IGAA..."-prefixed Instagram Login token, which graph.facebook.com can't
 * parse. This flow doesn't need a Facebook Page or a separately-looked-up
 * Business Account ID: the account ID is resolved directly from the token
 * via /me.
 *
 * Required env var (set as a GitHub Actions secret):
 *   IG_ACCESS_TOKEN        - Instagram Login access token (starts with IGAA)
 *
 * Optional:
 *   IG_BUSINESS_ACCOUNT_ID - overrides the auto-resolved account ID, if ever needed
 *   DRY_RUN=1  - build the carousel payload and log it, but don't call the
 *                publish endpoints and don't advance state.json
 *   CHECK_CREDENTIALS=1 - read-only check that the token works, no publish
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const GRAPH_VERSION = 'v23.0';
const GRAPH_BASE = `https://graph.instagram.com/${GRAPH_VERSION}`;
const REPO = 'Fooble-Official/golden-society-club-posts';
const BRANCH = 'main';
const STATE_PATH = path.join(__dirname, '..', 'state.json');
const POSTS_DIR = path.join(__dirname, '..');

const TOKEN = process.env.IG_ACCESS_TOKEN;
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

// The cron fires hourly (UTC, fixed); this returns the actual current hour
// in Pacific time (DST-aware via the IANA tz database), so the target-hour
// check stays correct year-round instead of drifting when Daylight/Standard
// Time changes.
function currentPacificHour() {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    hour12: false,
  }).format(new Date());
  return parseInt(hourStr, 10);
}

// Commits and pushes state.json immediately, in-process, right after a
// successful publish — not as a separate downstream workflow step. This
// closes the window where the process could crash or lose network between
// "Instagram confirmed the post" and "the queue advance is durably saved"
// down to essentially nothing. If the push itself fails (e.g. a network
// blip), the pre-publish reconciliation check below is the backstop: it
// looks at Instagram's own recent posts, not just local state, so a stale
// state.json can't cause a duplicate on the next run.
function commitAndPushState() {
  const git = (...args) => execFileSync('git', args, { cwd: POSTS_DIR, stdio: 'pipe' });
  try {
    git('config', 'user.name', 'golden-society-bot');
    git('config', 'user.email', 'actions@users.noreply.github.com');
    git('add', 'state.json');
    try {
      git('diff', '--quiet', '--cached');
      return; // nothing to commit
    } catch {
      // non-zero exit means there IS a diff — fall through to commit
    }
    git('commit', '-m', 'chore: advance to next post [skip ci]');
    git('pull', '--rebase', 'origin', 'main');
    git('push');
    console.log('state.json committed and pushed.');
  } catch (err) {
    console.error('WARNING: failed to commit/push state.json after a successful publish. ' +
      'The post IS live on Instagram. The next run\'s reconciliation check should still ' +
      'prevent a duplicate, but investigate this push failure directly.', err.message);
  }
}

async function main() {
  if (!TOKEN) {
    throw new Error('Missing IG_ACCESS_TOKEN env var.');
  }

  // Hour gate: only applies to the scheduled (cron) trigger, set via
  // HOUR_GATE_PACIFIC in the workflow. Manual runs (dry run, credential
  // check, or an explicit real test) skip this so they're not blocked by
  // time of day. Uses >= rather than == so that if the exact-noon trigger
  // gets delayed or dropped by GitHub (documented as possible under load),
  // the next hourly run still catches up same-day instead of permanently
  // skipping that day's post — the idempotency guard below prevents a
  // second run this same day from double-publishing once one succeeds.
  const hourGate = process.env.HOUR_GATE_PACIFIC ? parseInt(process.env.HOUR_GATE_PACIFIC, 10) : null;
  if (hourGate !== null && currentPacificHour() < hourGate) {
    return; // silent no-op — before the target hour, nothing to do yet
  }

  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

  // Kill switch: set state.paused = true to halt publishing without
  // touching the queue itself. next_order stays put; flip it back to
  // resume exactly where it left off.
  if (state.paused) {
    console.log('state.paused is true — publishing is halted. Set it back to false to resume.');
    return;
  }

  // Resolve the Instagram account ID directly from the token rather than
  // requiring it as a separately-configured secret — avoids the whole
  // Facebook-Page-lookup dance, which doesn't apply to this token type.
  const IG_USER_ID = process.env.IG_BUSINESS_ACCOUNT_ID || (await graphGet('me', { fields: 'user_id,username' })).user_id;

  // Credential check: confirms the token + account ID are valid and have
  // the right permissions via a harmless read-only call. Never publishes
  // anything and never touches state.json.
  if (process.env.CHECK_CREDENTIALS === '1') {
    const info = await graphGet(IG_USER_ID, { fields: 'username,name,id' });
    console.log('Credential check OK. Connected Instagram account:', info);
    return;
  }

  const index = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, 'index.json'), 'utf8'));
  const today = new Date().toISOString().slice(0, 10);

  // Start-date gate: even if the cron is enabled early, nothing publishes
  // before this date. Bump state.start_date (e.g. to slip the launch by a
  // day) instead of touching the schedule itself.
  if (state.start_date && today < state.start_date) {
    console.log(`Today (${today}) is before the configured start_date (${state.start_date}). Not publishing yet.`);
    return;
  }

  const entry = index.find(r => r.order === state.next_order);
  if (!entry) {
    console.log(`No post found for order ${state.next_order}. Nothing to publish (series complete?).`);
    return;
  }

  // Idempotency guard: if we already published this exact order today (e.g.
  // a manual re-trigger on top of the scheduled run), don't publish twice.
  if (state.last_published_order === state.next_order - 1 &&
      state.last_published_at && state.last_published_at.slice(0, 10) === today) {
    console.log(`Order ${state.last_published_order} was already published today (${today}). Skipping to avoid a duplicate post.`);
    return;
  }

  const folder = path.join(POSTS_DIR, entry.folder);
  const post = JSON.parse(fs.readFileSync(path.join(folder, 'post.json'), 'utf8'));
  const caption = fs.readFileSync(path.join(folder, 'caption.txt'), 'utf8');

  console.log(`Day ${post.order} of 365 — publishing order ${post.order}: "${post.title}" (${post.slide_count} slides)`);

  const imageUrls = post.slides.map(s => jsDelivrUrl(`${entry.folder}/${s.file}`));
  console.log('Slide URLs:', imageUrls);

  if (DRY_RUN) {
    console.log('DRY_RUN set — not calling the Graph API, not advancing state.json.');
    return;
  }

  // Reconciliation check: this is the real fix for "Instagram published
  // successfully, then the process crashed before local state was saved."
  // Rather than trusting local state alone, ask Instagram itself whether a
  // post matching this exact caption already went out recently. Local
  // state (and the in-process commit-immediately-after-publish below) is
  // the fast path; this is the backstop that makes it actually safe even
  // if that commit/push fails.
  const recent = await graphGet(IG_USER_ID + '/media', { fields: 'caption,timestamp', limit: 10 });
  const alreadyPosted = (recent.data || []).find(m => m.caption === caption);
  if (alreadyPosted) {
    console.log(`Found a matching post already on Instagram (id ${alreadyPosted.id}, ${alreadyPosted.timestamp}) — a previous run must have published it before crashing. Recovering state instead of republishing.`);
    state.next_order = post.order + 1;
    state.last_published_order = post.order;
    state.last_published_at = new Date().toISOString();
    state.last_published_media_id = alreadyPosted.id;
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
    commitAndPushState();
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

  // Step 3: publish it. This is the moment the post goes live — everything
  // after this line exists purely to durably record that fact as fast as
  // possible.
  const published = await graphPost(IG_USER_ID + '/media_publish', {
    creation_id: carousel.id,
  });

  console.log('Published:', published);

  // Advance state and persist immediately (in-process commit + push, not a
  // separate downstream step) to minimize the crash window. See the
  // reconciliation check above for the backstop if this still fails.
  state.next_order = post.order + 1;
  state.last_published_order = post.order;
  state.last_published_at = new Date().toISOString();
  state.last_published_media_id = published.id;
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
  console.log(`Advanced state.json -> next_order ${state.next_order}`);
  commitAndPushState();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
