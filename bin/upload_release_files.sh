#!/bin/bash

#TRAVIS_BRANCH=DVF-3234-minor-build-fixes
GALLERY_VERSION=7.14.3
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo ${VERSION}
echo ${GALLERY_VERSION}
echo ${TRAVIS_BRANCH}

if [ "${TRAVIS_BRANCH}" = "master" ] || [ "${TRAVIS_BRANCH}" = "DVF-3234-minor-build-fixes" ]; then

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
    wget https://playground.anychart.com/gallery/${GALLERY_VERSION}/download -O demos.zip
    unzip -q demos.zip -d demos
    rm demos.zip

    # zip files
    zip -q -r installation-package.zip *

    # ensure release path exists and clean
    # as far as cdn always hosts removed content, we are free to clean entire folder
    ssh $STATIC_HOST_SSH_STRING "
    mkdir -p /apps/static/cdn/releases/${VERSION} &&
    rm -rf /apps/static/cdn/releases/${VERSION}/* &&
    mkdir -p /apps/static/cdn/releases &&
    rm -rf /apps/static/cdn/releases/latest"

    # upload content
    scp installation-package.zip $STATIC_HOST_SSH_STRING:/apps/static/cdn/releases/${VERSION}/installation-package.zip

    # copy unzip release files and copy to latest
    ssh $STATIC_HOST_SSH_STRING "
    unzip -q -o /apps/static/cdn/releases/${VERSION}/installation-package.zip -d /apps/static/cdn/releases/${VERSION}/ &&
    cp -r /apps/static/cdn/releases/${VERSION} /apps/static/cdn/releases/latest"

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

    # drop cdn cache for uploaded files
    echo Dropping CDN cache
    cd ../
    python ./bin/drop_cdn_cache.py ${VERSION} ${CDN_ALIASE} ${CDN_CONSUMER_KEY} ${CDN_CONSUMER_SECRET} ${CDN_ZONE_ID}


    #./bin/upload_github_release.py $GITHUB_ACCESS_TOKEN
    #npm publish
fi



# 1. Не работает дроп кеша
# 2. На push в develop добавлять к версии хеш коммита

# todo
# 9. build export server ???
# 10. copy legacy files to latest cp -r /apps/static/cdn/releases/$TRAVIS_BRANCH/js/. /apps/static/cdn/js/latest/
# 11. uncomment legacy cache drop in drop_cdn_cache.py
# 12. попробовать разобратьяс с npm и модулями
# 13. Нужны проврки на существование тега, версии итд
# 14. Интеграция с сайтом
