var shell = require("pshell");

shell("node --version").then(res => {
  console.log("exit code:", res.code);
});

/****** console output *******
 /bin/sh -c node --version
 v4.5.0
 exit code: 0
******************************/