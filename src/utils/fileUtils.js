const fs = require("fs");

exports.readFile = function (filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : null;
};

exports.writeFile = function (filePath, content) {
  fs.writeFileSync(filePath, content);
};

exports.fileExists = function (filePath) {
  return fs.existsSync(filePath);
};
