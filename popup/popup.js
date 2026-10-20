const ids = Object.keys(SKIPSHORTS_DEFAULTS);

function syncSub() {
  const yt = document.getElementById("youtube").checked;
  const sub = document.getElementById("youtubeRedirect");
  sub.disabled = !yt;
  sub.parentElement.classList.toggle("off", !yt);
}

chrome.storage.sync.get(SKIPSHORTS_DEFAULTS, (s) => {
  for (const id of ids) {
    const box = document.getElementById(id);
    box.checked = s[id];
    box.addEventListener("change", () => {
      chrome.storage.sync.set({ [id]: box.checked });
      syncSub();
    });
  }
  syncSub();
});
