#!/bin/sh
# Builds Chromium and Firefox extension packages in dist/.
set -e
cd "$(dirname "$0")"
chromium_version=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
firefox_version=$(python3 -c "import json;print(json.load(open('manifest.firefox.json'))['version'])")
if [ "$chromium_version" != "$firefox_version" ]; then
  echo "manifest versions differ: Chromium $chromium_version, Firefox $firefox_version" >&2
  exit 1
fi
chromium_out="dist/skipshorts-$chromium_version.zip"
firefox_out="dist/skipshorts-firefox-$firefox_version.zip"
mkdir -p dist
rm -f "$chromium_out" "$firefox_out"
zip -r -X -q "$chromium_out" manifest.json src popup icons

tmp=$(mktemp -d "dist/.firefox.XXXXXX")
trap 'rm -rf "$tmp"' 0
trap 'exit 1' HUP INT TERM
cp manifest.firefox.json "$tmp/manifest.json"
cp -R src popup icons "$tmp/"
(cd "$tmp" && zip -r -X -q "../skipshorts-firefox-$firefox_version.zip" manifest.json src popup icons)

echo "$chromium_out"
echo "$firefox_out"
