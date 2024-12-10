const fs = require("fs");
const { readCommit } = require("./commitUtils");

exports.compareFiles = function (file, commit1Id, commit2Id) {
  const commit1Data = readCommit(commit1Id).files[file] || "";
  const commit2Data = readCommit(commit2Id).files[file] || "";

  return {
    file,
    commit1Content: commit1Data,
    commit2Content: commit2Data,
    diff: commit1Data !== commit2Data,
  };
};

exports.compareWithWorkingDirectory = function (file, commitId) {
  const commitData = readCommit(commitId).files[file] || "";
  const workingData = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "";

  return {
    file,
    workingContent: workingData,
    commitContent: commitData,
    diff: workingData !== commitData,
  };
};

exports.printDiff = function (diffResult) {
  const { file, commit1Content, commit2Content, diff } = diffResult;

  if (!diff) {
    console.log(`No differences in file: ${file}`);
    return;
  }

  console.log(`--- ${file} @ Commit 1`);
  console.log(commit1Content || "<empty>");
  console.log(`+++ ${file} @ Commit 2`);
  console.log(commit2Content || "<empty>");
};
