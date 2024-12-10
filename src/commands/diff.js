const fs = require("fs");
const path = require("path");

exports.execute = function (args) {
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
  const headCommit = branches[headBranch];

  if (!headCommit) {
    console.log("No commits in the current branch to compare.");
    return;
  }

  const commitPath = path.join(objectsPath, headCommit);
  const commitData = JSON.parse(fs.readFileSync(commitPath, "utf-8"));

  const stagedFilesPath = path.join(vcsPath, "index");
  const stagedFiles = fs
    .readFileSync(stagedFilesPath, "utf-8")
    .split("\n")
    .filter(Boolean);

  const diffs = [];
  stagedFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const currentContent = fs.readFileSync(file, "utf-8");
      const committedContent = commitData.files[file] || "";

      if (currentContent !== committedContent) {
        diffs.push({ file, diff: computeDiff(committedContent, currentContent) });
      }
    }
  });

  if (diffs.length === 0) {
    console.log("No differences found.");
  } else {
    diffs.forEach(({ file, diff }) => {
      console.log(`Differences in file: ${file}`);
      console.log(diff);
    });
  }
};

function computeDiff(oldContent, newContent) {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  const diffs = [];
  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    if (oldLines[i] !== newLines[i]) {
      diffs.push(`- ${oldLines[i] || ""}`);
      diffs.push(`+ ${newLines[i] || ""}`);
    }
  }
  return diffs.join("\n");
}
