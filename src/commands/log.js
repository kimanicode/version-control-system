const fs = require("fs");
const path = require("path");

exports.execute = function () {
  const vcsPath = ".vcs";
  const objectsPath = path.join(vcsPath, "objects");
  const branchesPath = path.join(vcsPath, "branches");
  const headPath = path.join(vcsPath, "HEAD");

  if (!fs.existsSync(vcsPath)) {
    console.error("Error: No repository found. Please run 'init' first.");
    return;
  }

  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));
  const headBranch = fs.readFileSync(headPath, "utf-8").trim();
  const currentCommit = branches[headBranch];

  if (!currentCommit) {
    console.log("No commits in the current branch.");
    return;
  }

  let commitId = currentCommit;

  console.log(`Commit history for branch '${headBranch}':`);
  while (commitId) {
    const commitPath = path.join(objectsPath, commitId);
    if (!fs.existsSync(commitPath)) {
      console.error(`Error: Commit object '${commitId}' is missing.`);
      return;
    }

    const commitData = JSON.parse(fs.readFileSync(commitPath, "utf-8"));
    console.log(`\nCommit: ${commitId}`);
    console.log(`Date: ${commitData.timestamp}`);
    console.log(`Message: ${commitData.message}`);

    // Traverse to the parent commit
    commitId = commitData.parent;
  }
};
