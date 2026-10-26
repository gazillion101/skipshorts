// Shared settings helper, loaded before each site script.
const SKIPSHORTS_DEFAULTS = {
  youtube: true,
  youtubeRedirect: true,
  facebook: true, // Reels
  facebookAds: true,
  facebookSuggested: true,
  facebookCarousels: true,
  facebookAI: true,
};

// Firefox Sync transmits preferences, so keep Firefox settings local.
const SKIPSHORTS_STORAGE_AREA =
  typeof browser !== "undefined" && typeof browser.runtime.getBrowserInfo === "function" ? "local" : "sync";

function skipShortsSettings(onChange) {
  const apply = (s) => onChange({ ...SKIPSHORTS_DEFAULTS, ...s });
  chrome.storage[SKIPSHORTS_STORAGE_AREA].get(SKIPSHORTS_DEFAULTS, apply);
  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area === SKIPSHORTS_STORAGE_AREA) chrome.storage[SKIPSHORTS_STORAGE_AREA].get(SKIPSHORTS_DEFAULTS, apply);
  });
}
