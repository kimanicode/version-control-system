const fs = require("fs");
const path = require("path");

exports.execute = function () {
  if (!fs.existsSync(".vcs")) {
    fs.mkdirSync(".vcs");
    fs.mkdirSync(path.join(".vcs", "objects"));
    fs.writeFileSync(path.join(".vcs", "index"), "");
    fs.writeFileSync(path.join(".vcs", "HEAD"), "master\n");
    fs.writeFileSync(path.join(".vcs", "branches"), JSON.stringify({ master: null }, null, 2));
    console.log("Initialized empty VCS repository in .vcs/");
  } else {
    console.log("Repository already initialized.");
  }
};
