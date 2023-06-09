const { execSync } = require("child_process");

module.exports = {
  async onPreBuild({ utils }) {
    try {
      // Run the 'just generate' command using execSync
      execSync("npx just generate", { stdio: "inherit" });
    } catch (error) {
      utils.build.failBuild("Failed to run `just generate` command", { error });
    }
  },
  async onBuild({ utils }) {
    try {
      // Run the 'npm run build' command
      await utils.run.command("npm run build");
    } catch (error) {
      utils.build.failBuild("Failed to run `npm run build` command", { error });
    }
  },
};
