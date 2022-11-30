#!/bin/bash
REPOSITORY=/home/ubuntu/sparta/project

cd $REPOSITORY

npm install

sudo pm2 kill

sudo pm2 start app.js