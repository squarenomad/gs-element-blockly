#!/bin/bash -e

# This script publishes a release of this element for bower on the master branch on github
hostname=$1
org=$2
repo=$3
branch=${4:-"master"} # default to master when branch isn't specified
connectionType=${5:-"https"} # defaults to https if type is set to null

# Calculate git clone url
[ "$connectionType" = "https" ] && { url=https://$hostname/$org/$repo.git; true; } || url=git@$hostname:$org/$repo.git;

mv bower.json ./app/bower.json
mv Readme.md ./app/Readme.md







# make folder (same as input, no checking!)
mkdir $repo
git clone $url --single-branch

# switch to gh-pages branch
pushd $repo >/dev/null
git checkout --orphan gh-pages

# remove all content
git rm -rf -q .

# use bower to install runtime deployment
bower cache clean $repo # ensure we're getting the latest from the desired branch.
git show ${branch}:bower.json > bower.json
echo "{
  \"directory\": \"components\"
}
" > .bowerrc
bower install
[ "$connectionType" = "https" ] && { bowerUrl=https://$hostname/$org/$repo.git#$branch; true; } || bowerUrl=git@$hostname:$org/$repo#$branch;
bower install $bowerUrl
git checkout ${branch} -- demo
rm bower.json .bowerrc
rm -rf components/$repo/demo
mv demo components/$repo/

# redirect by default to the component folder
echo "<META http-equiv="refresh" content=\"0;URL=components/$repo/\">" >index.html

# install the project's dev dependencies
if [ "$getdevdeps" = "yes" ]
then
  cd components/$repo
  bower install --config.directory="../"
  cd ../../
fi

# send it all to github
git add -A .
git commit -am 'seed gh-pages'
git push -u origin gh-pages --force
git checkout $branch

popd >/dev/null
