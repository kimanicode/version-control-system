const fs = require("fs");
const path = require("path");

exports.execute = function (args) {
  if (args.length === 0) {
    console.error("Error: Branch name is required.");
    return;
  }

  const branchName = args[0];
  const vcsPath = ".vcs";
  const branchesPath = path.join(vcsPath, "branches");
  const headPath = path.join(vcsPath, "HEAD");

  if (!fs.existsSync(vcsPath)) {
    console.error("Error: No repository found. Please run 'init' first.");
    return;
  }

  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));

  if (!branches[branchName]) {
    console.error(`Error: Branch '${branchName}' does not exist.`);
    return;
  }

  // Updating HEAD to point to the new branch
  fs.writeFileSync(headPath, `${branchName}\n`);
  console.log(`Switched to branch '${branchName}'.`);
};
