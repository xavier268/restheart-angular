#! /bin/bash

echo "Installing and building everything then reconstructing the docker images"

## Mongo
cd mongo
docker build -t mongo .
cd ..

## Restheart
cd restheart 
mvn clean install 
docker build -t restheart .
cd ..

## Client-main
cd client
npm install
npm run aot
docker build -t client .
cd ..

echo "Done"

