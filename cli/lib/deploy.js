const ghpages = require('gh-pages');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { loadConfig, updateConfig, configExists } = require('./config');
const { verifyAuth } = require('./auth');

/**
 * Deploy the site to GitHub Pages
 */
async function deploySite() {
  // Check if initialized
  if (!configExists()) {
    console.log(chalk.red('\n✗ Project not initialized'));
    console.log('Run ' + chalk.cyan('airpod-deploy init') + ' first\n');
    process.exit(1);
  }

  // Verify authentication
  if (!verifyAuth()) {
    process.exit(1);
  }

  const config = loadConfig();
  const { siteDir, branch, githubUsername, repoName } = config;

  // Verify site directory exists
  const cwd = process.cwd();
  console.log(`Debug - CWD: ${cwd}`);
  console.log(`Debug - siteDir: ${siteDir}`);
  const sitePath = path.join(cwd, siteDir);
  console.log(`Debug - sitePath: ${sitePath}`);

  if (!fs.existsSync(sitePath)) {
    console.log(chalk.red(`\n✗ Site directory not found: ${siteDir}`));
    process.exit(1);
  }

  const indexPath = path.join(sitePath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log(chalk.red(`\n✗ index.html not found in ${siteDir}/`));
    process.exit(1);
  }

  console.log(chalk.bold('\n🚀 Deploying to GitHub Pages...\n'));
  console.log(chalk.dim(`  Site: ${siteDir}/`));
  console.log(chalk.dim(`  Branch: ${branch}`));
  console.log(chalk.dim(`  URL: https://${githubUsername}.github.io/${repoName}\n`));

  const spinner = ora('Publishing to GitHub Pages').start();

  return new Promise((resolve, reject) => {
    const options = {
      branch: branch,
      message: `Deploy: ${new Date().toISOString()}`,
      dotfiles: false,
      repo: `https://github.com/${githubUsername}/${repoName}.git`
    };
    console.log(`Debug - Options:`, options);

    ghpages.publish(
      sitePath,
      options,
      (err) => {
        if (err) {
          spinner.fail('Deployment failed');
          console.log(chalk.red(`\n✗ Error: ${err.message}\n`));

          // Provide helpful error messages
          if (err.message.includes('Permission denied')) {
            console.log(chalk.yellow('This might be a permission issue. Try:'));
            console.log(chalk.cyan('  gh auth login'));
          } else if (err.message.includes('remote')) {
            console.log(chalk.yellow('Remote repository issue. Check that:'));
            console.log(chalk.cyan('  1. The repository exists on GitHub'));
            console.log(chalk.cyan('  2. You have push access'));
            console.log(chalk.cyan('  3. Run: git remote -v'));
          }

          reject(err);
        } else {
          spinner.succeed('Deployment successful');

          // Update last deployment timestamp
          updateConfig({
            lastDeployment: new Date().toISOString()
          });

          console.log(chalk.bold.green('\n✓ Your site is live!\n'));
          console.log(chalk.cyan(`  🌐 ${chalk.underline(`https://${githubUsername}.github.io/${repoName}`)}\n`));
          console.log(chalk.dim('  Note: It may take 1-2 minutes for changes to appear\n'));

          resolve();
        }
      }
    );
  });
}

/**
 * Show deployment status
 */
function showStatus() {
  if (!configExists()) {
    console.log(chalk.red('\n✗ Project not initialized'));
    console.log('Run ' + chalk.cyan('airpod-deploy init') + ' first\n');
    process.exit(1);
  }

  const config = loadConfig();
  const { githubUsername, repoName, branch, siteDir, lastDeployment } = config;

  console.log(chalk.bold('\n📊 Deployment Status\n'));
  console.log(chalk.cyan('Repository:') + ` ${githubUsername}/${repoName}`);
  console.log(chalk.cyan('Branch:') + ` ${branch}`);
  console.log(chalk.cyan('Site Directory:') + ` ${siteDir}/`);
  console.log(chalk.cyan('Live URL:') + ` https://${githubUsername}.github.io/${repoName}`);

  if (lastDeployment) {
    const deployDate = new Date(lastDeployment);
    console.log(chalk.cyan('Last Deployed:') + ` ${deployDate.toLocaleString()}`);
  } else {
    console.log(chalk.cyan('Last Deployed:') + ` ${chalk.dim('Never')}`);
  }

  // Check if there are uncommitted changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim().length > 0) {
      console.log(chalk.yellow('\n⚠ You have uncommitted changes'));
    }
  } catch (error) {
    // Git not available or not a repo
  }

  console.log('');
}

/**
 * Open the live site in browser
 */
function openSite() {
  if (!configExists()) {
    console.log(chalk.red('\n✗ Project not initialized'));
    console.log('Run ' + chalk.cyan('airpod-deploy init') + ' first\n');
    process.exit(1);
  }

  const config = loadConfig();
  const { githubUsername, repoName } = config;
  const url = `https://${githubUsername}.github.io/${repoName}`;

  console.log(chalk.cyan(`\n🌐 Opening: ${url}\n`));

  // Detect platform and open URL
  const platform = process.platform;
  const openCommand = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';

  try {
    execSync(`${openCommand} ${url}`, { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.yellow('Could not open browser automatically'));
    console.log(chalk.cyan(`Please visit: ${url}\n`));
  }
}

module.exports = {
  deploySite,
  showStatus,
  openSite
};
