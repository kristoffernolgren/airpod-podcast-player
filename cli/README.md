# AirPod Podcast Deployer

CLI tool for deploying AirPod Podcast Player to GitHub Pages.

## Installation

### Global Installation (Recommended)

```bash
npm install -g airpod-podcast-deployer
```

### Local Development

```bash
cd cli
npm install
npm link
```

## Prerequisites

One of the following authentication methods:

1. **GitHub CLI (Recommended)**
   ```bash
   brew install gh
   gh auth login
   ```

2. **Git with SSH**
   - Configure SSH keys with GitHub
   - Add remote: `git remote add origin git@github.com:username/repo.git`

## Commands

### `airpod-deploy init`

Initialize the project for GitHub Pages deployment.

This command will:
- Initialize a Git repository (if needed)
- Detect or prompt for your GitHub username
- Create a GitHub repository (if using gh CLI)
- Configure the deployment settings
- Create `.airpod-deploy.json` config file

**Usage:**
```bash
airpod-deploy init
```

**Interactive prompts:**
- GitHub username (auto-detected if possible)
- Repository name (default: `airpod-podcast-player`)
- Confirm repository creation
- Initial commit and push

---

### `airpod-deploy deploy`

Deploy the site to GitHub Pages.

This command will:
- Validate project setup
- Check authentication
- Publish `site/` directory to `gh-pages` branch
- Display the live URL

**Usage:**
```bash
airpod-deploy deploy
```

**What happens:**
1. Copies `site/` contents to `gh-pages` branch
2. Commits with timestamp
3. Pushes to GitHub
4. GitHub Pages auto-deploys within 1-2 minutes

---

### `airpod-deploy status`

Show deployment status and configuration.

**Usage:**
```bash
airpod-deploy status
```

**Displays:**
- Repository name and owner
- Deployment branch
- Site directory
- Live URL
- Last deployment timestamp
- Uncommitted changes warning

---

### `airpod-deploy open`

Open the live site in your default browser.

**Usage:**
```bash
airpod-deploy open
```

---

## Configuration

The tool creates `.airpod-deploy.json` in your project root:

```json
{
  "githubUsername": "your-username",
  "repoName": "airpod-podcast-player",
  "branch": "gh-pages",
  "siteDir": "site",
  "lastDeployment": "2024-01-15T10:30:00.000Z"
}
```

**Note:** This file is excluded from Git (via `.gitignore`) as it contains user-specific settings.

## Project Structure Requirements

Your project must have this structure:

```
your-project/
├── site/
│   └── index.html    # Required
├── cli/              # Optional (if developing locally)
└── .gitignore
```

The `site/` directory can contain any static files (CSS, JS, images, etc.).

## Workflow

### First-Time Setup

```bash
cd your-project
airpod-deploy init
# Follow prompts
airpod-deploy deploy
```

### Regular Updates

```bash
# Edit site/index.html
airpod-deploy deploy
# Site updates in 1-2 minutes
```

### Check Deployment

```bash
airpod-deploy status
airpod-deploy open
```

## Troubleshooting

### "Authentication required"

**Solution:** Install and authenticate with GitHub CLI
```bash
brew install gh
gh auth login
```

Or configure git remote:
```bash
git remote add origin git@github.com:username/repo.git
```

### "Project not initialized"

**Solution:** Run init command first
```bash
airpod-deploy init
```

### "Permission denied" during deploy

**Solution:** Check GitHub authentication
```bash
gh auth status
# Or
ssh -T git@github.com
```

### "Site directory not found"

**Solution:** Ensure `site/index.html` exists
```bash
mkdir -p site
mv index.html site/
```

### Deployment succeeds but site shows 404

**Possible causes:**
1. GitHub Pages not enabled (check repo settings)
2. Wrong branch selected (should be `gh-pages`)
3. Propagation delay (wait 1-2 minutes)

**Check GitHub Pages settings:**
1. Go to repo settings
2. Pages section
3. Ensure source is `gh-pages` branch

## How It Works

1. **`gh-pages` package** handles deployment:
   - Creates/updates `gh-pages` branch
   - Copies `site/` contents
   - Commits with timestamp
   - Pushes to GitHub

2. **GitHub Pages** automatically deploys:
   - Detects `gh-pages` branch
   - Serves static files
   - Updates within 1-2 minutes

3. **No build process needed**:
   - Single HTML file
   - All CSS/JS embedded
   - Ready to deploy as-is

## Publishing to npm

If you want to publish this CLI tool to npm:

```bash
cd cli
npm login
npm publish
```

Then anyone can install with:
```bash
npm install -g airpod-podcast-deployer
```

## Development

### Local Testing

```bash
cd cli
npm install
npm link
airpod-deploy --help
```

### Unlinking

```bash
npm unlink -g airpod-podcast-deployer
```

## Dependencies

- **gh-pages** - GitHub Pages deployment
- **commander** - CLI framework
- **chalk** - Terminal styling
- **ora** - Loading spinners
- **prompts** - Interactive prompts
- **simple-git** - Git operations

## License

MIT
