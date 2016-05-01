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
    cd ./dist
    git init
    git add --all
    git commit -m "Automatic bower module deploy"
    git remote add origin https://$GH_TOKEN@github.com/AlvarezAriel/gs-element-starter.git
#    git push --force --quiet origin master > /dev/null 2>&1
    git push --force origin master
  }

  deploy_gh_master


elif [ "$TRAVIS_BRANCH" = "prod" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]  && [ "$TRAVIS_NODE_VERSION" != "5.1" ]
then
  echo "Do Nothing, only deploy with Node 5.1"
else
  npm test
fi
