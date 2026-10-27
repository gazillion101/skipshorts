const ids = Object.keys(SKIPSHORTS_DEFAULTS);

function syncSub() {
  const yt = document.getElementById("youtube").checked;
  const sub = document.getElementById("youtubeRedirect");
  sub.disabled = !yt;
  sub.parentElement.classList.toggle("off", !yt);
}

chrome.storage[SKIPSHORTS_STORAGE_AREA].get(SKIPSHORTS_DEFAULTS, (s) => {
  for (const id of ids) {
    const box = document.getElementById(id);
    box.checked = s[id];
    box.addEventListener("change", () => {
      chrome.storage[SKIPSHORTS_STORAGE_AREA].set({ [id]: box.checked });
      syncSub();
    });
  }
  syncSub();
});

// X is opt-in: its options stay greyed out until access to x.com is granted.
// The background script registers the X content script once it is.
const xAccess = document.getElementById("xAccess");
const xOptions = document.getElementById("xOptions");

function showX(granted) {
  xAccess.hidden = granted;
  xOptions.classList.toggle("off", !granted);
}

chrome.permissions.contains({ origins: SKIPSHORTS_X_ORIGINS }, showX);
document.getElementById("xGrant").addEventListener("click", () => {
  chrome.permissions.request({ origins: SKIPSHORTS_X_ORIGINS }, showX);
});
