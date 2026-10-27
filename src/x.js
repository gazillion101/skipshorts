(() => {
  // X marks its building blocks with data-testid attributes, which don't
  // depend on the interface language.
  const CELL = '[data-testid="cellInnerDiv"]';
  const isPost = (cell) => cell.querySelector('article[data-testid="tweet"]');
  const isUser = (cell) => cell.querySelector('[data-testid="UserCell"]');

  let settings = {};
  let observer = null;

  function hide(cell) {
    if (cell && !cell.hasAttribute("data-skipshorts")) cell.setAttribute("data-skipshorts", "");
  }

  // "Who to follow" in the home timeline: a run of account cells with a
  // heading cell above and a "Show more" cell below. Account lists elsewhere
  // (followers, search People tab) are left alone.
  function sweepFollow() {
    if (location.pathname !== "/home") return;
    for (const u of document.querySelectorAll(`[data-testid="primaryColumn"] ${CELL} [data-testid="UserCell"]`)) {
      const cell = u.closest(CELL);
      if (cell.hasAttribute("data-skipshorts")) continue;
      hide(cell);
      const prev = cell.previousElementSibling;
      if (prev && !isPost(prev) && !isUser(prev)) hide(prev);
      const next = cell.nextElementSibling;
      if (next && !isPost(next) && !isUser(next)) hide(next);
    }
  }

  function update() {
    const root = document.documentElement;
    // X is a single-page app, so the home-only rules follow the current path.
    root.classList.toggle("skipshorts-x-home", location.pathname === "/home");
    if (settings.xFollow) sweepFollow();
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      update();
    });
  }

  skipShortsSettings((s) => {
    settings = s;
    const root = document.documentElement;
    root.classList.toggle("skipshorts-x-ads", s.xAds);
    root.classList.toggle("skipshorts-x-follow", s.xFollow);
    root.classList.toggle("skipshorts-x-grok", s.xGrok);
    root.classList.toggle("skipshorts-x-video", s.xVideo);
    // Start from a clean slate so turning an option off brings its cells back.
    for (const el of document.querySelectorAll("[data-skipshorts]")) el.removeAttribute("data-skipshorts");
    if (!observer) {
      observer = new MutationObserver(schedule);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    schedule();
  });
})();
