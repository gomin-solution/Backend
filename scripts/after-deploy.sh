#!/bin/bash
REPOSITORY=/home/ubuntu/src

cd $REPOSITORY

npm install

sudo pm2 kill

sudo pm2 start app.js