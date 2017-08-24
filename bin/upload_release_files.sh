#!/bin/bash
set -ev
if [ "${TRAVIS_BRANCH}" = "DVF-3234-minor-build-fixes" ]; then

    # copy bin files
    cp ./bin/binaries_wrapper_end.txt ./dist/binaries_wrapper_end.txt
    cp ./bin/binaries_wrapper_start.txt ./dist/binaries_wrapper_start.txt

    # go to dist directory
    cd ./dist/

    # download docs
    wget https://docs.anychart.com/download -O docs.zip
    unzip docs.zip -d docs

    # download demos
    wget https://playground.anychart.com/gallery/7.14.3/download -O demos.zip
    unzip demos.zip -d demos

    # zip files
    zip -r upload.zip *

    # create release branch
    ssh $STATIC_HOST_SSH_STRING "mkdir -p /apps/static/cdn/releases/$TRAVIS_BRANCH"
    scp upload.zip $STATIC_HOST_SSH_STRING:/apps/static/cdn/releases/$TRAVIS_BRANCH/upload.zip
    ssh $STATIC_HOST_SSH_STRING "unzip -o /apps/static/cdn/releases/$TRAVIS_BRANCH/upload.zip -d /apps/static/cdn/releases/$TRAVIS_BRANCH/ && rm /apps/static/cdn/releases/$TRAVIS_BRANCH/upload.zip"

fi