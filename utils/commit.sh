#!/bin/bash

## remove all __pycache__ files
find . -name '*.pyc' | xargs -n 1 git rm
find . -name '__pycache__' | xargs -n 1 git rm -rf

rm -rf .idea/

git add *
git rm -rf --cached migrations
git rm -rf --cached venv
git rm -f --cached dev.db
git commit -m "$1"