# SkipShorts: block YouTube Shorts and Facebook Reels

A free, open-source Chrome extension that **removes YouTube Shorts and Facebook Reels from your feeds**,
so you can watch what you came for without getting pulled into endless short-video scrolling.

- No tracking, no ads, no data collection. It only stores your on/off settings.
- No account, no setup. Install it and Shorts and Reels disappear.
- Tiny and fast: plain CSS and a few lines of JavaScript, with no remote code.

## What it hides

**YouTube Shorts**
- Shorts shelves on the home page, subscriptions, search results, and the watch-page sidebar
- Individual Shorts mixed into video grids and lists
- The Shorts button in the sidebar and mini-sidebar
- The Shorts tab on channel pages and the "Shorts" search filter
- Optional: opens any `youtube.com/shorts/...` link in the normal video player instead of the Shorts player

**Facebook**
- Reels: "Reels" shelves and reel posts in the feed, the Reels shortcut in the left sidebar, and the Reels icon in the top bar
- Ads: sponsored posts in the feed and the "Sponsored" box in the right column
- Suggested posts: posts from pages and groups you don't follow (the ones with a **Follow** or **Join** button next to the name)
- Suggestion carousels: "People you may know" and "Your group suggestions"
- AI content: posts carrying Meta's **AI content** label, including a friend's share of such a post.
  Only labeled posts are caught; unlabeled AI content can't be detected reliably.

Each of these can be switched on or off separately from the toolbar popup. Changes take effect immediately, without reloading the page.

## Install

The extension isn't on the Chrome Web Store yet. To install it:

1. Download `skipshorts-<version>.zip` from the [latest release](https://github.com/gazillion101/skipshorts/releases/latest) and unzip it.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right corner).
4. Click **Load unpacked** and select the unzipped folder (the one containing `manifest.json`).

It also works in other Chromium browsers: Microsoft Edge, Brave, Opera, and Vivaldi.

## FAQ

**Does it delete anything from my YouTube or Facebook account?**
No. It only hides Shorts and Reels on the page you're viewing. Nothing is changed in your account.

**Can I still watch a Short if someone sends me a link?**
Yes. With the redirect option on (the default), a Shorts link opens in the regular YouTube player.
Turn the option off in the popup to keep the Shorts player.

**Something slipped through. What do I do?**
YouTube and Facebook change their pages often. Please [open an issue](https://github.com/gazillion101/skipshorts/issues)
with a screenshot and the page URL.

## How it works

- Elements are hidden with `display: none` rather than deleted from the page. Deleting elements that
  YouTube's and Facebook's code manages tends to break scrolling and infinite loading.
- YouTube Shorts are matched by their page elements and `/shorts/` links.
- Facebook scrambles its page markup, so posts are found by structure: Reels by their `/reel/` links,
  ads by their ad-link labels, and suggested posts by the Follow/Join button in the post header.
  Suggestion carousels are found by their titles and Join group buttons.
  Text labels (shelf and carousel titles, "Sponsored", "Follow", "Join") are matched in English only.

## Building

Run `./package.sh` to build `dist/skipshorts-<version>.zip` (the version comes from `manifest.json`).

## License

[MIT](LICENSE)
