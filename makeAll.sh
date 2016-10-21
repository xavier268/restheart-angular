#! /bin/bash

echo "Installing and building everything"

## Mongo
cd mongo
docker build .
cd ..

## Restheart
cd restheart 
mvn clean install 
docker build .
cd ..

## Client-main
cd client
npm install
npm run aot
docker build .
cd ..

echo "Done"

