const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const objectsPath = path.join(".vcs", "objects");

// Generate a hash ID for a commit object
exports.generateCommitId = function (data) {
  return crypto.createHash("sha1").update(JSON.stringify(data)).digest("hex");
};

// Write a commit object to the objects folder
exports.writeCommit = function (commitId, commitData) {
  const commitPath = path.join(objectsPath, commitId);
  fs.writeFileSync(commitPath, JSON.stringify(commitData, null, 2));
};

// Read a commit object from the objects folder
exports.readCommit = function (commitId) {
  const commitPath = path.join(objectsPath, commitId);
  if (!fs.existsSync(commitPath)) {
    throw new Error(`Commit ${commitId} not found`);
  }
  return JSON.parse(fs.readFileSync(commitPath, "utf-8"));
};

// Get the parent commit ID of a commit
exports.getParentCommit = function (commitId) {
  const commitData = this.readCommit(commitId);
  return commitData.parent || null;
};
