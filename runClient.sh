#! /bin/bash

echo "Building and launching the main client container"
cd client
npm run aot
cd ..
docker build -t client client/
docker kill client
docker rm client
docker run -d --name=client -p 80:8080 client
