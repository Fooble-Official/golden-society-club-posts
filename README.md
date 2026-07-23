# The Golden Society Club — Instagram posts

Asset host + daily auto-publisher for @TheGoldenSocietyClub's 328-post
business-principles carousel series.

- `NNN_slug/` — one folder per post at the repo root, each with `post.json`,
  `caption.txt`, and `slide-01.png…slide-0N.png`. Also `index.json` at the root,
  listing every post's folder, slide count, and cover type.
- `publish/publish.js` — reads `state.json`, builds a carousel from the next
  post's slides (served via jsDelivr), publishes it through the Instagram
  API (Instagram Login flow, `graph.instagram.com`), then advances `state.json`.
- `publish/refresh_token.js` — refreshes the long-lived access token (expires
  every 60 days; this is run weekly so it never lapses).
- `.github/workflows/daily-post.yml` — runs `publish.js` hourly; it only
  actually publishes on the run landing at 12:00pm Pacific (DST-aware), or
  catches up on the next hourly run if that one was delayed/dropped.
- `.github/workflows/refresh-token.yml` — refreshes `IG_ACCESS_TOKEN` weekly.
- `state.json` — tracks which post publishes next, the last published post's
  Instagram media ID, the campaign start date, and a `paused` kill switch.

## One-time setup

1. Add repo secrets (Settings → Secrets and variables → Actions):
   - `IG_ACCESS_TOKEN` — Instagram Login access token (starts with `IGAA`)
   - `GH_PAT` — a GitHub Personal Access Token used only to let the weekly
     refresh workflow update `IG_ACCESS_TOKEN` automatically (the default
     Actions token deliberately can't manage repo secrets). Create a
     fine-grained PAT scoped to just this repo, with **Secrets: Read and
     write** permission, no other permissions needed.
2. Test with a manual credential check first: Actions tab → "Daily Instagram
   carousel post" → Run workflow → set `check_only: true`. Confirms the
   token works without publishing anything.
3. Test with a dry run: same workflow → `dry_run: true`. Logs the built
   payload without calling the publish endpoints.
4. `state.json`'s `start_date` gates the first real post — nothing publishes
   before that date regardless of the schedule being enabled.

## How it works

Each day the workflow calls the Instagram API's carousel flow: create one
child media container per slide image (`is_carousel_item=true`), poll each
until its `status_code` is `FINISHED`, then a `CAROUSEL` container
referencing all children plus the caption, poll that too, then
`media_publish`. Immediately after a successful publish, the script commits
`state.json` (with the new `next_order` and the returned Instagram media ID)
directly, in-process — not as a separate step — to minimize any window where
a crash could leave local state stale.

Before publishing, it also checks Instagram's own recent posts for a caption
match — this is the actual safeguard against double-posting if a previous
run crashed *after* Meta confirmed the post but *before* local state was
saved: the next run recognizes the post already exists and recovers instead
of republishing.

Failed posts never advance the queue — `next_order` only moves forward after
a confirmed successful `media_publish` response.

## Kill switch

Set `"paused": true` in `state.json` and push. The workflow will no-op every
run until it's set back to `false` — the queue position is untouched.

## Failure visibility

GitHub's default is to email the repo owner when a scheduled workflow fails,
but this is a per-account setting. Verify it directly: Settings →
Notifications → System → Actions, on the GitHub account that actually
owns/admins this repo.
