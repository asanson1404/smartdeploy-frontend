const { spawnSync } = require('child_process');

module.exports = {
  async onPreBuild({ utils }) {
    try {
      // Run the 'npx just generate' command using spawnSync
      spawnSync('npx', ['just', 'generate'], { stdio: 'inherit' });
    } catch (error) {
      utils.build.failBuild('Failed to run `just generate` command', { error });
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
