(() => {
  let enabled = false;
  let redirect = false;
  let observer = null;

  // Send /shorts/<id> to the regular watch page.
  function redirectShorts() {
    if (!enabled || !redirect) return;
    const m = location.pathname.match(/^\/shorts\/([\w-]+)/);
    if (m) location.replace(`/watch?v=${m[1]}${location.hash}`);
  }

  // Things that can only be matched by text: filter chips labelled "Shorts".
  function flagByText() {
    const chips = document.querySelectorAll(
      "yt-chip-cloud-chip-renderer:not([data-skipshorts]), chip-view-model:not([data-skipshorts])"
    );
    for (const chip of chips) {
      if (chip.textContent.trim() === "Shorts") chip.setAttribute("data-skipshorts", "");
    }
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      flagByText();
    });
  }

  function start() {
    document.documentElement.classList.add("skipshorts-on");
    redirectShorts();
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

  // YouTube is a single-page app; catch in-app navigation to /shorts/.
  document.addEventListener("yt-navigate-start", redirectShorts);
  document.addEventListener("yt-navigate-finish", redirectShorts);
  window.addEventListener("popstate", redirectShorts);

  skipShortsSettings((s) => {
    document.documentElement.classList.toggle("skipshorts-promos", s.youtubePromos);
    enabled = s.youtube;
    redirect = s.youtubeRedirect;
    enabled ? start() : stop();
  });
})();
