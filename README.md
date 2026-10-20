# SkipShorts

Chrome extension that hides YouTube Shorts and Facebook Reels from your feeds.

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked** and select this folder

Use the toolbar popup to toggle each site. Changes apply immediately, with no reload needed.

## What it hides

**YouTube:** Shorts shelves (home, subscriptions, search, watch sidebar), individual Shorts in grids and lists,
the Shorts sidebar entry, the channel Shorts tab, and the "Shorts" search filter chip. Optionally sends
`/shorts/<id>` URLs to the normal `/watch?v=<id>` player.

**Facebook:** Reels shelves and reel posts in the news feed, groups, and pages, plus the Reels sidebar shortcut.

## Notes

- Elements are hidden with `display: none` rather than deleted from the DOM. Deleting nodes that
  YouTube's and Facebook's frameworks own tends to break scrolling and infinite loading.
- Facebook obfuscates its markup, so Reels are found by their `/reel/` links and by shelf headings in English.

## Packaging

Run `./package.sh` to build `dist/skipshorts-<version>.zip` (the version comes from `manifest.json`).
Upload that zip to the Chrome Web Store developer dashboard, or share it so others can unzip it and use **Load unpacked**.
