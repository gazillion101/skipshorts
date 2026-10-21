(() => {
  // Facebook's class names are obfuscated and change constantly, so posts are
  // identified by structure: links, aria-labels, and header buttons.
  const REEL_LINK = 'a[href*="/reel/"], a[href*="/reels/"]';
  const SHELF_TITLES = new Set(["Reels", "Reels and short videos", "Short videos"]);
  // Ads carry an "Open ad link to <site>" label or ad-attribution links.
  const AD_MARKER = '[aria-label^="Open ad link"], a[attributionsrc], a[href*="/ads/about"]';
  // Posts from pages/groups you don't follow show a Follow or Join button next to the author.
  const SUGGEST_BUTTONS = new Set(["Follow", "Join"]);
  // "People you may know" / "Your group suggestions" carousels: found by title,
  // or by having several Add friend / Join group / Remove suggestion buttons.
  const CAROUSEL_TITLES = new Set([
    "People you may know",
    "People you might know",
    "Your group suggestions",
    "Suggested groups",
    "Groups you might like",
  ]);
  // Meta's AI label, shown as a button under the author's name of the post
  // (or of the shared post inside it).
  const AI_LABELS = new Set(["AI content", "AI info"]);
  const CAROUSEL_BUTTON = '[aria-label="Add friend" i], [aria-label="Join group" i], [aria-label^="Remove suggested" i]';

  let settings = {};
  let observer = null;

  function isFeedUnit(el) {
    const parent = el.parentElement;
    return (
      el.matches('[data-pagelet^="FeedUnit"], [aria-posinset]') ||
      (parent && parent.getAttribute("role") === "feed")
    );
  }

  function feedUnitOf(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (isFeedUnit(n)) return n;
    }
    return null;
  }

  // Facebook pads some labels with zero-width characters.
  function text(el) {
    return el.textContent.replace(/[\u200b-\u200d\ufeff]/g, "").trim();
  }

  function hide(el) {
    if (el && !el.hasAttribute("data-skipshorts")) el.setAttribute("data-skipshorts", "");
  }

  function sweepReels() {
    // Reels shelves and reel posts inside the news feed / groups / pages.
    for (const a of document.querySelectorAll(`[role="main"] ${REEL_LINK}`)) {
      if (a.closest("[data-skipshorts]")) continue;
      hide(feedUnitOf(a));
    }

    // Shelves identified by their heading, in case they contain no reel links yet.
    for (const h of document.querySelectorAll('[role="main"] h2, [role="main"] h3, [role="main"] span[dir="auto"]')) {
      if (!SHELF_TITLES.has(text(h))) continue;
      if (h.closest("[data-skipshorts]")) continue;
      hide(feedUnitOf(h));
    }

    // "Reels" shortcut in the left sidebar and top nav.
    for (const a of document.querySelectorAll(
      '[role="navigation"] a[href*="/reel/"], [role="navigation"] a[href$="/reels/"], [role="navigation"] a[aria-label="Reels"]'
    )) {
      hide(a.closest("li") || a);
    }
  }

  function sweepAds() {
    for (const m of document.querySelectorAll(`[role="main"] ${AD_MARKER}`)) {
      if (m.closest("[data-skipshorts]")) continue;
      hide(feedUnitOf(m));
    }

    // "Sponsored" block in the right column: hide the largest wrapper that
    // holds only that heading, so other right-column sections stay.
    for (const h of document.querySelectorAll('[role="complementary"] h3')) {
      if (text(h) !== "Sponsored") continue;
      let box = h;
      while (
        box.parentElement &&
        box.parentElement.getAttribute("role") !== "complementary" &&
        box.parentElement.querySelectorAll("h3").length === 1
      ) {
        box = box.parentElement;
      }
      hide(box);
    }
  }

  function sweepSuggested() {
    for (const btn of document.querySelectorAll('[role="main"] [aria-posinset] h4 [role="button"]')) {
      if (!SUGGEST_BUTTONS.has(text(btn))) continue;
      if (btn.closest("[data-skipshorts]")) continue;
      // Only the post's own header counts; a shared post nested inside a
      // friend's post has its own header and Follow button.
      const unit = feedUnitOf(btn);
      if (unit && unit.querySelector("h4") === btn.closest("h4")) hide(unit);
    }
  }

  function sweepCarousels() {
    for (const b of document.querySelectorAll(`[role="main"] [aria-posinset] :is(${CAROUSEL_BUTTON})`)) {
      if (b.closest("[data-skipshorts]")) continue;
      const unit = feedUnitOf(b);
      if (unit && unit.querySelectorAll(CAROUSEL_BUTTON).length >= 2) hide(unit);
    }
    for (const h of document.querySelectorAll(
      '[role="main"] [aria-posinset] :is(h2, h3, h4, [role="heading"], span[dir="auto"])'
    )) {
      if (!CAROUSEL_TITLES.has(text(h))) continue;
      if (h.closest("[data-skipshorts]")) continue;
      hide(feedUnitOf(h));
    }
  }

  function sweepAI() {
    for (const btn of document.querySelectorAll('[role="main"] [aria-posinset] [role="button"]')) {
      if (!AI_LABELS.has(text(btn))) continue;
      if (btn.closest('[data-skipshorts], [aria-label^="Comment"]')) continue;
      // Also covers a friend sharing an AI-labeled post: the content itself is AI.
      hide(feedUnitOf(btn));
    }
  }

  function sweep() {
    if (settings.facebook) sweepReels();
    if (settings.facebookAds) sweepAds();
    if (settings.facebookSuggested) sweepSuggested();
    if (settings.facebookCarousels) sweepCarousels();
    if (settings.facebookAI) sweepAI();
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sweep();
    });
  }

  function apply(s) {
    settings = s;
    // Start from a clean slate so turning an option off brings its posts back.
    for (const el of document.querySelectorAll("[data-skipshorts]")) el.removeAttribute("data-skipshorts");

    const any = s.facebook || s.facebookAds || s.facebookSuggested || s.facebookCarousels || s.facebookAI;
    document.documentElement.classList.toggle("skipshorts-on", any);
    if (any && !observer) {
      observer = new MutationObserver(schedule);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    } else if (!any && observer) {
      observer.disconnect();
      observer = null;
    }
    if (any) schedule();
  }

  skipShortsSettings(apply);
})();
