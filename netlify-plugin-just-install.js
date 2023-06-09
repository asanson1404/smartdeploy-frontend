module.exports = {
    async onPreBuild({ utils }) {
      try {
        // Run the shell command to install `just`
        await utils.run.command('sh -c "$(curl --location https://github.com/casey/just/releases/latest/download/just-install.sh)"')
      } catch (error) {
        utils.build.failBuild('Failed to install `just`', { error })
      }
    },
  }
  