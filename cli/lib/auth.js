const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Check if GitHub CLI is installed and authenticated
 */
function checkGhCli() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    execSync('gh auth status', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if Git is configured with a remote
 */
function checkGitRemote() {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    return remote.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get GitHub username from various sources
 */
function getGithubUsername() {
  // Try gh CLI first
  if (checkGhCli()) {
    try {
      const username = execSync('gh api user --jq .login', { encoding: 'utf8' }).trim();
      if (username) return username;
    } catch (error) {
      // Continue to next method
    }
  }

  // Try git config
  try {
    const gitUrl = execSync('git config user.name', { encoding: 'utf8' }).trim();
    if (gitUrl) return gitUrl;
  } catch (error) {
    // Continue to next method
  }

  // Try to extract from remote URL
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const match = remote.match(/github\.com[:/]([^/]+)/);
    if (match) return match[1];
  } catch (error) {
    // No remote configured
  }

  return null;
}

/**
 * Verify authentication and provide helpful error messages
 */
function verifyAuth() {
  const hasGhCli = checkGhCli();
  const hasGitRemote = checkGitRemote();

  if (!hasGhCli && !hasGitRemote) {
    console.log(chalk.red('\nAuthentication required!'));
    console.log('\nPlease choose one of the following options:\n');
    console.log(chalk.yellow('1. Install and authenticate with GitHub CLI (recommended):'));
    console.log('   brew install gh');
    console.log('   gh auth login\n');
    console.log(chalk.yellow('2. Configure git with a GitHub remote:'));
    console.log('   git remote add origin git@github.com:username/repo.git\n');
    return false;
  }

  return true;
}

module.exports = {
  checkGhCli,
  checkGitRemote,
  getGithubUsername,
  verifyAuth
};
