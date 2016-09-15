var shell = require("pshell");

shell("node --version", {echoCommand: false, captureOutput: true}).then(res => {
  console.log("stdout:", JSON.stringify(res.stdout));
  console.log("exit code:", res.code);
});
