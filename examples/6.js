var shell = require("pshell").context({echoCommand: false});

shell('node -e "process.exit(1)"').then(res => {
  console.log("exit code:", res.code);
}).catch(err => {
  console.error("error occurred:", err.message);
});

/****** console output *******
 error occurred: [Error: Process 26546 exited with code 1]
******************************/
