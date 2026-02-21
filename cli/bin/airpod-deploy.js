#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { initProject } = require('../lib/init');
const { deploySite, showStatus, openSite } = require('../lib/deploy');

const program = new Command();

program
  .name('airpod-deploy')
  .description('Deploy AirPod Podcast Player to GitHub Pages')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize GitHub repository and configure GitHub Pages')
  .action(async () => {
    try {
      await initProject();
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description('Deploy site to GitHub Pages')
  .action(async () => {
    try {
      await deploySite();
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show deployment status and configuration')
  .action(() => {
    try {
      showStatus();
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command('open')
  .description('Open the live site in your browser')
  .action(() => {
    try {
      openSite();
    } catch (error) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
