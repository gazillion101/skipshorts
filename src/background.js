// The X content script is registered only while the user has granted access to
// x.com (requested from the popup), so X stays opt-in.

const X_SCRIPT = {
  id: "x",
  matches: ["*://*.x.com/*"],
  css: ["src/x.css"],
  js: ["src/settings.js", "src/x.js"],
  runAt: "document_start",
};

let pending = Promise.resolve();
function syncX() {
  // Serialized: onInstalled and onAdded can fire together.
  pending = pending.then(async () => {
    const granted = await chrome.permissions.contains({ origins: X_SCRIPT.matches });
    const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [X_SCRIPT.id] });
    // Re-register on every sync so an update picks up changed file lists.
    if (registered.length) await chrome.scripting.unregisterContentScripts({ ids: [X_SCRIPT.id] });
    if (granted) await chrome.scripting.registerContentScripts([X_SCRIPT]);
  }).catch((e) => console.error("SkipShorts: X script registration failed", e));
}

chrome.runtime.onInstalled.addListener(syncX);
chrome.runtime.onStartup.addListener(syncX);
chrome.permissions.onAdded.addListener(syncX);
chrome.permissions.onRemoved.addListener(syncX);
