var shell = require("pshell");

shell("node --version").then(res => {
  console.log("exit code:", res.code);
});
