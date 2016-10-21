#! /bin/bash

MYREP="057259519792.dkr.ecr.eu-west-1.amazonaws.com"
WHEN=$(date -u +%Y-%m-%d-%H-%m)
echo "Preparing to push client, mongo and restheart images to $MYREPO"
docker tag mongo:latest $MYREP/mongo:$WHEN
docker tag restheart:latest $MYREP/restheart:$WHEN
docker tag client:latest $MYREP/client:$WHEN

docker push $MYREP/mongo:$WHEN &
docker push $MYREP/restheart:$WHEN &
docker push $MYREP/client:$WHEN &

echo "Pushing all the images tagged with :$WHEN initited in the background"
