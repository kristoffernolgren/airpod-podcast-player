# Deployment Instructions

Deploy using git push.

## Setup (One Time)

Already done:
- ✓ Git repo initialized
- ✓ GitHub repo created: `kristoffernolgren/airpod-podcast-player`
- ✓ GitHub Pages enabled (serves from `gh-pages` branch)

## Deploy Changes

```bash
# Edit the file
open site/index.html

# Commit and push
git add .
git commit -m "Your change description"
git push
```

GitHub Pages auto-deploys from the `gh-pages` branch in ~1-2 minutes.

## Manual Deploy to gh-pages Branch

If you need to manually update the gh-pages branch:

```bash
# One-time: Install gh-pages helper (optional)
npm install -g gh-pages

# Deploy site/ folder to gh-pages branch
gh-pages -d site

# Or do it manually with git:
git checkout gh-pages
cp -r site/* .
git add .
git commit -m "Deploy"
git push
git checkout main
```

## Live Site

https://kristoffernolgren.github.io/airpod-podcast-player

## Repository Structure

```
/
├── site/
│   └── index.html    # The podcast player app
├── README.md
└── claude.md         # This file
```

That's it. No build process, no dependencies, just HTML.
