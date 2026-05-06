#!/bin/bash
set -e

IMAGE="lereve-server:latest"
TAR="lereve-server.tar.gz"
REMOTE="ec2"
REMOTE_DIR="~/lereve"

echo ">> Building image (linux/amd64)..."
docker build --platform linux/amd64 -t $IMAGE .

echo ">> Saving & compressing..."
docker save $IMAGE | gzip > $TAR

echo ">> Uploading to EC2..."
scp $TAR $REMOTE:$REMOTE_DIR/

echo ">> Deploying on EC2..."
ssh $REMOTE "cd $REMOTE_DIR && docker load < $TAR && docker compose up -d --no-deps app && rm $TAR"

echo ">> Cleaning up local tar..."
rm $TAR

echo ">> Done!"
