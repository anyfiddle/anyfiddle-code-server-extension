#!/bin/bash
distDir="dist"
rm -rf ${distDir}
mkdir -p ${distDir}

packageFolder="${distDir}/anyfiddle-code-server-extension"
mkdir -p ${packageFolder}

npm run compile

cp package.json "${packageFolder}"
cp -r node_modules "${packageFolder}"
cp -r out "${packageFolder}"

cd ${distDir}
tar -zcf anyfiddle-code-server-extension.tar.gz anyfiddle-code-server-extension