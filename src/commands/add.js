const fs = require("fs");
const path = require("path");
const { minimatch } = require("minimatch"); // Updated import

function loadIgnorePatterns() {
  const ignoreFile = ".vcsignore";
  if (!fs.existsSync(ignoreFile)) return [];

  const patterns = fs
    .readFileSync(ignoreFile, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#")); // Exclude comments and empty lines

  return patterns;
}

function isIgnored(file, ignorePatterns) {
  return ignorePatterns.some((pattern) => minimatch(file, pattern));
}

exports.execute = function (args) {
  if (!args.length) {
    console.error("Error: No files specified for staging.");
    return;
  }

  const vcsPath = ".vcs";
  const indexPath = path.join(vcsPath, "index");

  if (!fs.existsSync(vcsPath)) {
    console.error("Error: No repository found. Please run 'init' first.");
    return;
  }

  const ignorePatterns = loadIgnorePatterns();
  let index = fs.readFileSync(indexPath, "utf-8").split("\n").filter(Boolean);
  const filesToAdd = args.filter((file) => {
    if (!fs.existsSync(file)) {
      console.error(`Error: File '${file}' does not exist.`);
      return false;
    }

    if (isIgnored(file, ignorePatterns)) {
      console.log(`Ignored: '${file}'`);
      return false;
    }

    return true;
  });

  if (filesToAdd.length === 0) {
    console.log("No new files were added to the staging area.");
    return;
  }

  filesToAdd.forEach((file) => {
    if (!index.includes(file)) {
      index.push(file);
    }
  });

  fs.writeFileSync(indexPath, index.join("\n"));
  console.log("Files staged for commit:", filesToAdd);
};