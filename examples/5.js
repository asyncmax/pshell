var shell = require("pshell").context({echoCommand: false, captureOutput: true
});

Promise.all([
  shell("node --version"),
  shell("npm --version")
]).then(res => {
  process.stdout.write("Node version: " + res[0].stdout);
  process.stdout.write("NPM version: " + res[1].stdout);
});

