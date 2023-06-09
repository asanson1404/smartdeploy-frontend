module.exports = {
    async onPreBuild({ utils }) {
      try {
        // Run the shell command to install `just` from npm
        await utils.run.command('npm install just');
      } catch (error) {
        utils.build.failBuild('Failed to install `just`', { error });
      }
    },
  };
  