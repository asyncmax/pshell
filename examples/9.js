var shell = require("pshell");

shell('node -e "console.log(JSON.stringify({a:1,b:2}))"', {
  echoCommand: false,
  captureOutput: function(buf) {
    return JSON.parse(buf.toString());
  }
}).then(function(res) {
  console.log("type:", typeof res.stdout);
  console.log("data:", res.stdout);
});

/****** console output *******
 type: object
 data: { a: 1, b: 2 }
******************************/
