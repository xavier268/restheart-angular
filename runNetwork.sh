#! /bin/bash

echo "Launching/creating a private bridged network"
echo "All prevous custom networks are removed"

docker network rm $( docker network ls -q )
docker network create MYBRIDGE
docker network ls
docker network inspect MYBRIDGE
