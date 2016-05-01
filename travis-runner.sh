#!/bin/bash -e
set -o pipefail

if [ "$TRAVIS_BRANCH" = "prod" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" = "5.1" ]
then
  git config --global user.email "gobstones@gmail.com"
  git config --global user.name "auto deployer"

  # Stamp index.html with the date and time of PSK's deploying
  date_value=`date`
  sed -i.tmp1 "s/This is another card./This is another card. PSK Deployed on: $date_value/" app/index.html

  deploy_gh_master () {
    # Deploying to GitHub Pages! (http://polymerelements.github.io/polymer-starter-kit)
    echo Deploying to GitHub as Bower component
#    sed -i.tmp "s/\/\/ app.baseUrl = '\/polymer-starter-kit/app.baseUrl = '\/polymer-starter-kit/" app/js/app.js
#    sed -i.tmp2 "s/<\/head>/\  \<script>'https:'!==window.location.protocol\&\&(window.location.protocol='https')<\/script>&/g" app/index.html
    gulp build-deploy-gh-master
    # Undoing Changes to PSK for GitHub Pages
    cp app/js/app.js.tmp app/js/app.js
    rm app/js/app.js.tmp
    cp app/index.html.tmp2 app/index.html
    rm app/index.html.tmp2
  }

  deploy_gh_master

  # Revert to orginal index.html and delete temp file
  cp app/index.html.tmp1 app/index.html
  rm app/index.html.tmp1

elif [ "$TRAVIS_BRANCH" = "prod" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" != "5.1" ]
then
  echo "Do Nothing, only deploy with Node 5.1"
else
  npm test
fi
