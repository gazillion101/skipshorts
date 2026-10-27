// Shared settings helper, loaded before each site script.
const SKIPSHORTS_DEFAULTS = {
  youtube: true,
  youtubeRedirect: true,
  youtubePromos: true,
  facebook: true, // Reels
  facebookAds: true,
  facebookSuggested: true,
  facebookCarousels: true,
  facebookAI: true,
};

// Firefox Sync transmits preferences, so keep Firefox settings local. Detected
// by the extension URL scheme, which (unlike runtime.getBrowserInfo) is also
// available to content scripts, so the popup and the pages agree on the area.
const SKIPSHORTS_STORAGE_AREA = chrome.runtime.getURL("").startsWith("moz-extension:") ? "local" : "sync";

function skipShortsSettings(onChange) {
  const apply = (s) => onChange({ ...SKIPSHORTS_DEFAULTS, ...s });
  chrome.storage[SKIPSHORTS_STORAGE_AREA].get(SKIPSHORTS_DEFAULTS, apply);
  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area === SKIPSHORTS_STORAGE_AREA) chrome.storage[SKIPSHORTS_STORAGE_AREA].get(SKIPSHORTS_DEFAULTS, apply);
  });
}
