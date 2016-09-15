var shell = require("pshell");

shell("node --version", {echoCommand: false}).then(res => {
  console.log("exit code:", res.code);
});
