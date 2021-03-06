var shell = require("pshell");

shell.options.echoCommand = false;
shell.options.captureOutput = true;

Promise.all([
  shell("node --version"),
  shell("npm --version")
]).then(res => {
  process.stdout.write("Node version: " + res[0].stdout);
  process.stdout.write("NPM version: " + res[1].stdout);
});

/****** console output *******
 Node version: v4.5.0
 NPM version: 3.10.6
******************************/
