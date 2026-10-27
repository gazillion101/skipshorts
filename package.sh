#!/bin/sh
# Builds Chromium and Firefox extension packages in dist/.
# The two differ only in manifest.json: the Firefox build gets the keys from
# manifest.firefox.json merged in, so version and description live in one place.
set -e
cd "$(dirname "$0")"
version=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
chromium_out="dist/skipshorts-$version.zip"
firefox_out="dist/skipshorts-firefox-$version.zip"
mkdir -p dist
rm -f "$chromium_out" "$firefox_out"
zip -r -X -q "$chromium_out" manifest.json src popup icons

tmp=$(mktemp -d "dist/.firefox.XXXXXX")
trap 'rm -rf "$tmp"' 0
trap 'exit 1' HUP INT TERM
python3 - "$tmp/manifest.json" <<'PY'
import json, sys
m = json.load(open("manifest.json"))
m.update(json.load(open("manifest.firefox.json")))
with open(sys.argv[1], "w") as f:
    json.dump(m, f, indent=2)
    f.write("\n")
PY
cp -R src popup icons "$tmp/"
(cd "$tmp" && zip -r -X -q "../skipshorts-firefox-$version.zip" manifest.json src popup icons)

echo "$chromium_out"
echo "$firefox_out"
