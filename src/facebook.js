(() => {
  // Facebook's class names are obfuscated and change constantly, so we find
  // Reels by their links and hide the surrounding feed unit.
  const REEL_LINK = 'a[href*="/reel/"], a[href*="/reels/"]';
  const SHELF_TITLES = new Set(["Reels", "Reels and short videos", "Short videos"]);

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

  function hide(el) {
    if (el && !el.hasAttribute("data-skipshorts")) el.setAttribute("data-skipshorts", "");
  }

  function sweep() {
    // Reels shelves and reel posts inside the news feed / groups / pages.
    for (const a of document.querySelectorAll(`[role="main"] ${REEL_LINK}`)) {
      if (a.closest("[data-skipshorts]")) continue;
      hide(feedUnitOf(a));
    }

    // Shelves identified by their heading, in case they contain no reel links yet.
    for (const h of document.querySelectorAll('[role="main"] h2, [role="main"] h3, [role="main"] span[dir="auto"]')) {
      if (!SHELF_TITLES.has(h.textContent.trim())) continue;
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

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      sweep();
    });
  }

  function start() {
    document.documentElement.classList.add("skipshorts-on");
    if (!observer) {
      observer = new MutationObserver(schedule);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    schedule();
  }

  function stop() {
    document.documentElement.classList.remove("skipshorts-on");
    observer?.disconnect();
    observer = null;
  }

  skipShortsSettings((s) => (s.facebook ? start() : stop()));
})();
