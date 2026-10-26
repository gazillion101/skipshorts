const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const settings = fs.readFileSync("src/settings.js", "utf8");
const storageArea = (browser) =>
  vm.runInNewContext(`${settings}\nSKIPSHORTS_STORAGE_AREA`, {
    browser,
    chrome: { storage: { local: {}, sync: {} } },
  });

assert.equal(storageArea({ runtime: { getBrowserInfo() {} } }), "local");
assert.equal(storageArea(undefined), "sync");
