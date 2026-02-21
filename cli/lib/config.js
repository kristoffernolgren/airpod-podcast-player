const fs = require('fs');
const path = require('path');

const CONFIG_FILE = '.airpod-deploy.json';

/**
 * Get the path to the config file in the project root
 */
function getConfigPath() {
  return path.join(process.cwd(), CONFIG_FILE);
}

/**
 * Load configuration from .airpod-deploy.json
 * Returns default config if file doesn't exist
 */
function loadConfig() {
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    return {
      githubUsername: null,
      repoName: 'airpod-podcast-player',
      branch: 'gh-pages',
      siteDir: 'site',
      lastDeployment: null
    };
  }

  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    throw new Error(`Failed to load config: ${error.message}`);
  }
}

/**
 * Save configuration to .airpod-deploy.json
 */
function saveConfig(config) {
  const configPath = getConfigPath();

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to save config: ${error.message}`);
  }
}

/**
 * Update specific config values
 */
function updateConfig(updates) {
  const config = loadConfig();
  const newConfig = { ...config, ...updates };
  saveConfig(newConfig);
  return newConfig;
}

/**
 * Check if config file exists
 */
function configExists() {
  return fs.existsSync(getConfigPath());
}

module.exports = {
  loadConfig,
  saveConfig,
  updateConfig,
  configExists
};
