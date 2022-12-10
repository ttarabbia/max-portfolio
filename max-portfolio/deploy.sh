#!/usr/bin/env sh

yarn build
cd ..
git add max-portfolio/dist
git commit -m "I ran the script"
git subtree push --prefix max-portfolio/dist origin gh-pages