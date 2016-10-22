#! /bin/bash

echo "Docker login to amazon ecr with default local credentials"
aws ecr get-login --region eu-west-1 | bash
 
