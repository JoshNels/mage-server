#!/bin/bash

dir_array=(
"./service"
"../web-app"
"../plugins/arcgis"
"../image/service"
"../../nga-msi"
"../random"
)

echo "Remove node_modules from instance"
cd ./instance
rm -rf node_modules
cd ..

for d in "${dir_array[@]}";do
    cd $d;
    echo "Remove node_modules from $PWD"
    rm -rf node_modules
    npm run clean
done

cd ../..

for d in "${dir_array[@]}";do
    cd $d;
    echo "Building $PWD"
    npm ci
    npm run build
done

cd ../../instance
echo "npm i in $PWD"
npm i --omit=dev ../service ../web-app/dist/app ../plugins/arcgis ../plugins/image/service ../plugins/nga-msi ../plugins/random
echo "Starting server..."
npm run start:dev