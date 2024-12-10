const fs = require("fs");
const path = require("path");

const branchesPath = path.join(".vcs", "branches");
const headPath = path.join(".vcs", "HEAD");

// Read the current branch
exports.getCurrentBranch = function () {
  return fs.readFileSync(headPath, "utf-8").trim();
};

// Get the commit ID of a branch
exports.getBranchCommit = function (branchName) {
  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));
  return branches[branchName] || null;
};

// Update the commit ID of a branch
exports.updateBranch = function (branchName, commitId) {
  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));
  branches[branchName] = commitId;
  fs.writeFileSync(branchesPath, JSON.stringify(branches, null, 2));
};

// List all branches
exports.listBranches = function () {
  const branches = JSON.parse(fs.readFileSync(branchesPath, "utf-8"));
  return Object.keys(branches);
};
