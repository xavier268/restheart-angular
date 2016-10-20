#! /bin/bash
echo "Copying critical node_modules folders to the dist folder"
cp node_modules/core-js/client/shim.min.js            dist/shim.min.js
cp node_modules/zone.js/dist/zone.js                  dist/zone.js
cp node_modules/reflect-metadata/Reflect.js           dist/Reflect.js

ls dist/
