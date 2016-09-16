var shell = require("pshell");

shell("node --version", {echoCommand: false}).then(res => {
  console.log("exit code:", res.code);
});

/****** console output *******
 v4.5.0
 exit code: 0
******************************/
