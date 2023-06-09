const { spawnSync } = require('child_process');

module.exports = {
  async onPreBuild({ utils }) {
    try {
      // Run the 'npm run preinstall' command using spawnSync
      spawnSync('npm', ['run', 'preinstall'], { stdio: 'inherit' });
    } catch (error) {
      utils.build.failBuild('Failed to run `npm run preinstall` command', { error });
    }
  },
  async onBuild({ utils }) {
    try {
      // Run the 'npm run build' command
      await utils.run.command('npm run build');
    } catch (error) {
      utils.build.failBuild('Failed to run `npm run build` command', { error });
    }
  },
};
