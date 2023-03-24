#!/bin/bash

dir_array=(
"./service"
"../web-app"
"../plugins/arcgis/service"
"../../image/service"
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
