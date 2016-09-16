var shell = require("pshell").context({echoCommand: false, ignoreError: true});

shell('node -e "process.exit(1)"').then(res => {
  console.log("exit code:", res.code);
}).catch(err => {
  console.error("error occurred:", err.message);
});

/****** console output *******
 exit code: 1
******************************/
