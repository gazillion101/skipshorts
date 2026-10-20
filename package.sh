#!/bin/sh
# Builds dist/skipshorts-<version>.zip, ready for the Chrome Web Store.
set -e
cd "$(dirname "$0")"
version=$(python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
out="dist/skipshorts-$version.zip"
mkdir -p dist
rm -f "$out"
zip -r -X -q "$out" manifest.json src popup icons
echo "$out"
