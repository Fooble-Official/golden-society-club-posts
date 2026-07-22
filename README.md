# The Golden Society Club — Instagram posts

Asset host + daily auto-publisher for @TheGoldenSocietyClub's 328-post
business-principles carousel series.

- `NNN_slug/` — one folder per post at the repo root, each with `post.json`,
  `caption.txt`, and `slide-01.png…slide-0N.png`. Also `index.json` at the root,
  listing every post's folder, slide count, and cover type.
- `publish/publish.js` — reads `state.json`, builds a carousel from the next
  post's slides (served via jsDelivr), publishes it through the Instagram
  Graph API, then advances `state.json`.
- `.github/workflows/daily-post.yml` — runs `publish.js` on a daily schedule.
- `state.json` — tracks which post number publishes next.

## One-time setup

1. Add two repo secrets (Settings → Secrets and variables → Actions):
   - `IG_ACCESS_TOKEN` — Meta System User access token
   - `IG_BUSINESS_ACCOUNT_ID` — Instagram Business Account ID
2. Uncomment the `schedule:` cron trigger in
   `.github/workflows/daily-post.yml`.
3. Test first with a manual dry run: Actions tab → "Daily Instagram carousel
   post" → Run workflow → set `dry_run: true`. Check the log for the built
   payload before doing a real (non-dry) manual run.

## How it works

Each day the workflow calls the Instagram Graph API's carousel flow:
create one child media container per slide image (`is_carousel_item=true`),
then a `CAROUSEL` container referencing all children plus the caption, then
`media_publish` on that container. On success it commits the incremented
`next_order` back to `state.json` so the following day picks up the next
post automatically.
