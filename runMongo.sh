#! /bin/bash

echo "Building and launching the mongo container"
echo "If a mongo container is running, it is killed and removed"
echo "However, the database data is kept"
docker kill mongo
docker rm mongo
docker build -t mongo mongo/
docker run -d --net="MYBRIDGE" --name=mongo -v data:/data/db mongo 
docker ps 
