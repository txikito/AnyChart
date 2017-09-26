#!/bin/bash

if [ "${TRAVIS_BRANCH}" = "master" ] || [[ "RC-8.0.0" == RC-* ]]; then
    VERSION=$(python build.py version)
elif [ "${TRAVIS_BRANCH}" = "develop" ]; then
    VERSION=$(python build.py version -c)
else
    VERSION=${TRAVIS_BRANCH}
fi

echo Version: ${VERSION}
echo Branch: ${TRAVIS_BRANCH}

# we can build release files only in case of dev release
if [ "${TRAVIS_BRANCH}" != "master" ]; then
    # build release files
    python ./build.py compile --output ./dist/js
    python ./build.py css --output ./dist/css
    python ./build.py themes --output ./dist/themes
fi

# copy bin files
cp ./bin/binaries_wrapper_end.txt ./dist/binaries_wrapper_end.txt
cp ./bin/binaries_wrapper_start.txt ./dist/binaries_wrapper_start.txt

# go to dist directory
cd ./dist/

# download docs
wget https://docs.anychart.com/download -O docs.zip
unzip -q docs.zip -d docs
rm docs.zip

# download demos
wget https://playground.anychart.com/gallery/latest/download -O demos.zip
unzip -q demos.zip -d demos
rm demos.zip

# zip files
zip -q -r installation-package.zip *

# ensure release paths exists and clean
# as far as cdn always serve removed content, we are free to clean entire folder
ssh $STATIC_HOST_SSH_STRING "
mkdir -p /apps/static/cdn/releases/${VERSION} &&
rm -rf /apps/static/cdn/releases/${VERSION}/*"

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    ssh $STATIC_HOST_SSH_STRING "
    mkdir -p /apps/static/cdn/releases &&
    rm -rf /apps/static/cdn/releases/latest"
fi

# upload content
scp installation-package.zip $STATIC_HOST_SSH_STRING:/apps/static/cdn/releases/${VERSION}/installation-package.zip

# copy unzip release files and copy to latest
ssh $STATIC_HOST_SSH_STRING "unzip -q -o /apps/static/cdn/releases/${VERSION}/installation-package.zip -d /apps/static/cdn/releases/${VERSION}/"

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    ssh $STATIC_HOST_SSH_STRING "cp -r /apps/static/cdn/releases/${VERSION} /apps/static/cdn/releases/latest"
fi

# copy legacy files by version and latest
ssh $STATIC_HOST_SSH_STRING "
rm -rf /apps/static/cdn/js/${VERSION} &&
cp -r /apps/static/cdn/releases/${VERSION}/js /apps/static/cdn/js/${VERSION} &&
rm -rf /apps/static/cdn/css/${VERSION} &&
cp -r /apps/static/cdn/releases/${VERSION}/css /apps/static/cdn/css/${VERSION} &&
rm -rf /apps/static/cdn/themes/${VERSION} &&
cp -r /apps/static/cdn/releases/${VERSION}/themes /apps/static/cdn/themes/${VERSION} &&
mkdir -p /apps/static/cdn/schemas/${VERSION} &&
cp /apps/static/cdn/releases/${VERSION}/json-schema.json /apps/static/cdn/schemas/${VERSION}/json-schema.json &&
cp /apps/static/cdn/releases/${VERSION}/xml-schema.xsd /apps/static/cdn/schemas/${VERSION}/xml-schema.xsd"

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    ssh $STATIC_HOST_SSH_STRING "
    rm -rf /apps/static/cdn/js/latest &&
    cp -r /apps/static/cdn/releases/${VERSION}/js /apps/static/cdn/js/latest &&
    rm -rf /apps/static/cdn/css/latest &&
    cp -r /apps/static/cdn/releases/${VERSION}/css /apps/static/cdn/css/latest &&
    rm -rf /apps/static/cdn/themes/latest &&
    cp -r /apps/static/cdn/releases/${VERSION}/themes /apps/static/cdn/themes/latest &&
    mkdir -p /apps/static/cdn/schemas/latest &&
    cp /apps/static/cdn/releases/${VERSION}/json-schema.json /apps/static/cdn/schemas/latest/json-schema.json &&
    cp /apps/static/cdn/releases/${VERSION}/xml-schema.xsd /apps/static/cdn/schemas/latest/xml-schema.xsd"
fi

# copy DEV legacy files by version
if [ "${TRAVIS_BRANCH}" != "master" ]; then
    ssh $STATIC_HOST_SSH_STRING "
    rm -rf /apps/static/js/${VERSION} &&
    cp -r /apps/static/cdn/releases/${VERSION}/js /apps/static/js/${VERSION} &&
    cp /apps/static/cdn/releases/${VERSION}/commit-hash.txt /apps/static/js/${VERSION}/commit-hash.txt &&
    rm -rf /apps/static/css/${VERSION} &&
    cp -r /apps/static/cdn/releases/${VERSION}/css /apps/static/css/${VERSION}"
fi

# drop cdn cache for uploaded files
echo Dropping CDN cache
cd ../
python ./bin/drop_cdn_cache.py ${VERSION} ${CDN_ALIASE} ${CDN_CONSUMER_KEY} ${CDN_CONSUMER_SECRET} ${CDN_ZONE_ID}


