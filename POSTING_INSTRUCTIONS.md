# Golden Society — Daily Posting Instructions (for Claude Code)

## What this is
328 Instagram carousel posts, one per business principle. Each lives in its own folder in `posts/`, prefixed by posting order (`001_`, `002_`, …).

## Each post folder contains
- `slide-01.png … slide-0N.png`  the carousel images IN ORDER (1080x1080). (Rendered separately — see RENDER_KIT.)
- `post.json`   machine-readable: caption, hashtags, slide roles, cover type, CTA type.
- `caption.txt`  ready-to-paste caption.

## Cadence
- Post ONE carousel per day, in folder order (001 first).
- Recommended time: 9:00am local. One post per day, no gaps.
- Account: @TheGoldenSocietyClub (goldensociety.club).

## Caption / CTA rules (already baked into caption.txt, keep them if regenerating)
- Every caption: a short summary of the principle + the reflection question + "Follow @TheGoldenSocietyClub for a new principle every day." + hashtags.
- Posts 1–7 (first week): follow CTA only. `cta_type: "follow_only"`.
- Posts 8 and later: ALSO include the Business OS pitch and "Get early access at the link in our bio." `cta_type: "os_plus_follow"`.

## Slide roles (order within each carousel)
cover → question → mental_model (if present) → sop (if present) → calculation → why (if present) → get_the_os
Covers alternate photo / green by `cover_type`.

## Posting via API (outline)
1. Read `posts/index.json` for the ordered list.
2. For the next unposted folder: upload `slide-*.png` in filename order as an IG carousel, using `caption.txt` as the caption.
3. Mark it posted (e.g., move folder name into a `posted.log`).
Use the Instagram Graph API (Content Publishing) or your scheduler of choice (Later, Buffer). The images + captions are pre-built; you only automate the upload + daily schedule.
