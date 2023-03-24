#!/bin/bash

dir_array=(
"./service"
"../web-app"
"../plugins/arcgis/service"
"../../image/service"
"../../nga-msi"
"../random"
)

for d in "${dir_array[@]}";do
    cd $d;
    echo "Building $PWD"
    npm ci
    npm run build
done

cd ../../instance
echo "npm i in $PWD"
npm i --omit=dev ../service ../web-app/dist/app ../plugins/arcgis/service ../plugins/image/service ../plugins/nga-msi ../plugins/random
