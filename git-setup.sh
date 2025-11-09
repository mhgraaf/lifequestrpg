#!/bin/bash
# Usage: ./git-setup.sh <your-repo-https-url>
set -e
if [ -z "$1" ]; then echo "Usage: $0 <git_repo_url>"; exit 1; fi
git init
git add .
git commit -m "Initial LifeQuest PWA"
git branch -M main
git remote add origin "$1"
git push -u origin main
