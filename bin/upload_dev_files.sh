zip -r upload.zip *
ssh $STATIC_HOST_SSH_STRING "
mkdir -p /apps/static/js/$TRAVIS_BRANCH/parts &&
mkdir -p /apps/static/css/$TRAVIS_BRANCH"

scp upload.zip $STATIC_HOST_SSH_STRING:/apps/static/js/$TRAVIS_BRANCH/upload.zip

ssh $STATIC_HOST_SSH_STRING "
unzip -o /apps/static/js/$TRAVIS_BRANCH/upload.zip -d /apps/static/js/$TRAVIS_BRANCH/ &&
mv /apps/static/js/$TRAVIS_BRANCH/*.css /apps/static/css/$TRAVIS_BRANCH/"