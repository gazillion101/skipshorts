// Shared settings helper, loaded before each site script.
const SKIPSHORTS_DEFAULTS = {
  youtube: true,
  youtubeRedirect: true,
  facebook: true, // Reels
  facebookAds: true,
  facebookSuggested: true,
};

function skipShortsSettings(onChange) {
  const apply = (s) => onChange({ ...SKIPSHORTS_DEFAULTS, ...s });
  chrome.storage.sync.get(SKIPSHORTS_DEFAULTS, apply);
  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area === "sync") chrome.storage.sync.get(SKIPSHORTS_DEFAULTS, apply);
  });
}
