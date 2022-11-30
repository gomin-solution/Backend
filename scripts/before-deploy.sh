#!/bin/bash
REPOSITORY=/home/ubuntu/sparta/project/src
sudo pm2 kill
cd $REPOSITORY

sudo rm -rf server