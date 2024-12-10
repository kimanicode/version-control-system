const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

exports.execute = function (args) {
  if (args.length === 0) {
    console.error("Error: Commit message is required.");
    return;
  }

  const message = args[0];
  const vcsPath = ".vcs";
  const indexPath = path.join(vcsPath, "index");
  const objectsPath = path.join(vcsPath, "objects");

  if (!fs.existsSync(vcsPath)) {
    console.error("Error: No repository found. Please run 'init' first.");
    return;
  }

  const index = fs.readFileSync(indexPath, "utf-8").split("\n").filter(Boolean);
  if (index.length === 0) {
    console.log("Nothing to commit.");
    return;
  }

  const files = {};
  index.forEach(file => {
    if (fs.existsSync(file)) {
      files[file] = fs.readFileSync(file, "utf-8");
    }
  });

  const currentCommit = getCurrentCommit(vcsPath);
  const commitData = {
    message,
    timestamp: new Date().toISOString(),
    files,
    parent: currentCommit
  };

  const commitId = crypto.createHash("sha1").update(JSON.stringify(commitData)).digest("hex");
  fs.writeFileSync(path.join(objectsPath, commitId), JSON.stringify(commitData, null, 2));

  updateBranch(vcsPath, commitId);
  fs.writeFileSync(indexPath, ""); // Clear the staging area

  console.log(`Committed as ${commitId.slice(0, 7)}`);
};

function getCurrentCommit(vcsPath) {
  const headPath = path.join(vcsPath, "HEAD");
  const branchesPath = path.join(vcsPath, "branches");

  const head = fs.readFileSync(headPath, "utf-8").trim();
  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));
  return branches[head];
}

function updateBranch(vcsPath, commitId) {
  const headPath = path.join(vcsPath, "HEAD");
  const branchesPath = path.join(vcsPath, "branches");

  const head = fs.readFileSync(headPath, "utf-8").trim();
  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));
  branches[head] = commitId;
  fs.writeFileSync(branchesPath, JSON.stringify(branches, null, 2));
}
