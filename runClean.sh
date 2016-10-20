#! /bin/bash

echo "Removing unecessary data - does not stop running containers"
docker rm $(docker ps -aq)
docker rmi $( docker images -q -f "dangling=true" )
docker images
docker volume ls
docker network ls
docker ps
