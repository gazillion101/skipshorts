const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const settings = fs.readFileSync("src/settings.js", "utf8");
const storageArea = (scheme) =>
  vm.runInNewContext(`${settings}\nSKIPSHORTS_STORAGE_AREA`, {
    chrome: { runtime: { getURL: (path) => `${scheme}://extension-id/${path}` }, storage: { local: {}, sync: {} } },
  });

// Content scripts and the popup must pick the same area, and content scripts
// have no browser.runtime.getBrowserInfo, so only getURL is provided here.
assert.equal(storageArea("moz-extension"), "local");
assert.equal(storageArea("chrome-extension"), "sync");
