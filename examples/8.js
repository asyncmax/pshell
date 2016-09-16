var shell = require("pshell").context({echoCommand: false});

var ret = shell.spawn("node", ["--version"], {captureOutput: true});

console.log("Node process ID:", ret.childProcess.pid);

ret.promise.then(function(res) {
  console.log("stdout:", JSON.stringify(res.stdout));
});

/****** console output *******
 Node process ID: 16372
 stdout: "v4.5.0\n"
******************************/
