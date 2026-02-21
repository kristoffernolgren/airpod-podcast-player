const { execSync } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const prompts = require('prompts');
const simpleGit = require('simple-git');
const { saveConfig } = require('./config');
const { checkGhCli, getGithubUsername } = require('./auth');

const git = simpleGit();

/**
 * Initialize the project for GitHub Pages deployment
 */
async function initProject() {
  console.log(chalk.bold('\n🚀 AirPod Podcast Player - GitHub Pages Setup\n'));

  // Check if git is initialized
  const isGitRepo = await checkGitRepo();
  if (!isGitRepo) {
    const spinner = ora('Initializing Git repository').start();
    try {
      await git.init();
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.fail('Failed to initialize Git repository');
      throw error;
    }
  } else {
    console.log(chalk.green('✓ Git repository already initialized'));
  }

  // Get GitHub username
  let username = getGithubUsername();
  if (!username) {
    const response = await prompts({
      type: 'text',
      name: 'username',
      message: 'Enter your GitHub username:',
      validate: value => value.length > 0 || 'Username is required'
    });
    username = response.username;
  } else {
    console.log(chalk.green(`✓ Detected GitHub username: ${username}`));
  }

  // Get repository name
  const defaultRepoName = 'airpod-podcast-player';
  const response = await prompts({
    type: 'text',
    name: 'repoName',
    message: 'Enter repository name:',
    initial: defaultRepoName
  });
  const repoName = response.repoName || defaultRepoName;

  // Check if site directory exists
  const fs = require('fs');
  const path = require('path');
  const siteDir = path.join(process.cwd(), 'site');
  if (!fs.existsSync(siteDir) || !fs.existsSync(path.join(siteDir, 'index.html'))) {
    console.log(chalk.red('\n✗ Error: site/index.html not found'));
    console.log('Please ensure your project has the following structure:');
    console.log('  site/');
    console.log('    └── index.html');
    process.exit(1);
  }

  // Check if GitHub CLI is available
  const hasGhCli = checkGhCli();

  if (hasGhCli) {
    // Try to create GitHub repo using gh CLI
    const createRepo = await prompts({
      type: 'confirm',
      name: 'value',
      message: `Create GitHub repository "${repoName}"?`,
      initial: true
    });

    if (createRepo.value) {
      const spinner = ora('Creating GitHub repository').start();
      try {
        execSync(`gh repo create ${repoName} --public --source=. --remote=origin`, {
          stdio: 'pipe'
        });
        spinner.succeed(`GitHub repository created: https://github.com/${username}/${repoName}`);
      } catch (error) {
        // Repository might already exist
        spinner.warn('Repository might already exist or creation failed');
        console.log(chalk.yellow('You can manually add the remote with:'));
        console.log(chalk.cyan(`  git remote add origin https://github.com/${username}/${repoName}.git`));
      }
    }
  } else {
    console.log(chalk.yellow('\n⚠ GitHub CLI not found'));
    console.log('Please create the repository manually at:');
    console.log(chalk.cyan(`  https://github.com/new`));
    console.log('\nThen add the remote:');
    console.log(chalk.cyan(`  git remote add origin https://github.com/${username}/${repoName}.git`));

    await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Press enter when ready to continue...',
      initial: true
    });
  }

  // Check if there are any files to commit
  const status = await git.status();
  if (status.files.length > 0) {
    const commitFiles = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Commit current changes?',
      initial: true
    });

    if (commitFiles.value) {
      const spinner = ora('Creating initial commit').start();
      try {
        await git.add('.');
        await git.commit('Initial commit: AirPod Podcast Player');
        spinner.succeed('Initial commit created');

        // Try to push
        const pushChanges = await prompts({
          type: 'confirm',
          name: 'value',
          message: 'Push to GitHub?',
          initial: true
        });

        if (pushChanges.value) {
          const pushSpinner = ora('Pushing to GitHub').start();
          try {
            await git.push('origin', 'main', ['--set-upstream']);
            pushSpinner.succeed('Pushed to GitHub');
          } catch (error) {
            // Try master branch if main fails
            try {
              await git.push('origin', 'master', ['--set-upstream']);
              pushSpinner.succeed('Pushed to GitHub');
            } catch (error) {
              pushSpinner.fail('Failed to push');
              console.log(chalk.yellow('\nYou may need to push manually:'));
              console.log(chalk.cyan('  git push -u origin main'));
            }
          }
        }
      } catch (error) {
        spinner.fail('Failed to create commit');
        throw error;
      }
    }
  }

  // Save configuration
  const config = {
    githubUsername: username,
    repoName: repoName,
    branch: 'gh-pages',
    siteDir: 'site',
    lastDeployment: null
  };
  saveConfig(config);

  // Success message
  console.log(chalk.bold.green('\n✓ Setup complete!\n'));
  console.log('Next steps:');
  console.log(chalk.cyan('  1. Deploy your site: ') + chalk.white('airpod-deploy deploy'));
  console.log(chalk.cyan('  2. Check status: ') + chalk.white('airpod-deploy status'));
  console.log(chalk.cyan('  3. Open live site: ') + chalk.white('airpod-deploy open'));
  console.log(chalk.dim(`\n  Your site will be available at: https://${username}.github.io/${repoName}\n`));
}

/**
 * Check if current directory is a git repository
 */
async function checkGitRepo() {
  try {
    const isRepo = await git.checkIsRepo();
    return isRepo;
  } catch (error) {
    return false;
  }
}

module.exports = {
  initProject
};
