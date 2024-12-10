const fs = require("fs-extra");
const path = require("path");

exports.execute = async function (args) {
  if (args.length < 2) {
    console.error("Usage: clone <source> <destination>");
    return;
  }

  const [source, destination] = args;
  const vcsPath = ".vcs";

  try {
    const sourceVCSPath = path.join(source, vcsPath);

    // Check if the source repository exists
    if (!fs.existsSync(sourceVCSPath)) {
      console.error(`Error: No repository found in '${source}'.`);
      return;
    }

    // Clone the repository
    await fs.copy(source, destination);
    console.log(`Repository cloned from '${source}' to '${destination}'.`);
  } catch (error) {
    console.error(`Error cloning repository: ${error.message}`);
  }
};
