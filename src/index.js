const { execSync } = require("child_process");

function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case "init":
        require("./commands/init").execute(args);
        break;
      case "add":
        require("./commands/add").execute(args);
        break;
      case "commit":
        require("./commands/commit").execute(args);
        break;
      case "log":
        require("./commands/log").execute(args);
        break;
      case "branch":
        require("./commands/branch").execute(args);
        break;
      case "checkout":
        require("./commands/checkout").execute(args);
        break;
      case "diff":
        require("./commands/diff").execute(args);
        break;
      case "clone":
        require("./commands/clone").execute(args);
        break;
      default:
        console.error("Unknown command");
        break;
    }
  } catch (error) {
    console.error("Error executing command:", error.message);
  }
}

main();
