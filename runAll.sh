#!/bin/bash

echo "Launching and running all containers"

./runNetwork.sh
./runMongo.sh
./runRestheart.sh
./runClient.sh

