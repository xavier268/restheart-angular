#! /bin/bash

echo "Building and launching the customized restheart container"
docker build -t restheart restheart/
echo "Killing and removing already running restheart containers"
docker kill restheart
docker rm restheart
docker run -d --net=MYBRIDGE -p 443:4443 --name=restheart restheart
docker ps
