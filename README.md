# pshell

Provides a simple Promise-based interface for running shell commands.

# How to use

> Basic usage

```js
var shell = require("pshell");

shell("node --version").then(res => {
  console.log("exit code:", res.code);
});

/****** console output *******
 /bin/sh -c node --version
 v4.5.0
 exit code: 0
******************************/
```

> Don't echo the commands.

```js
var shell = require("pshell");

shell("node --version", {echoCommand: false}).then(res => {
  console.log("exit code:", res.code);
});

/****** console output *******
 v4.5.0
 exit code: 0
******************************/
```

> Capture the output as a string.

```js
var shell = require("pshell");

shell("node --version", {echoCommand: false, captureOutput: true}).then(res => {
  console.log("stdout:", JSON.stringify(res.stdout));
  console.log("exit code:", res.code);
});

/****** console output *******
 stdout: "v4.5.0\n"
 exit code: 0
******************************/
```

> Configure the global options so you don't need to specify the same options everytime.

```js
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
```

> You can get a pre-configured version of `shell` function by calling the `context` API. This is a good way to avoid modifying the global options. Other `pshell` users in the same process won't be affected.

```js
var shell = require("pshell").context({echoCommand: false, captureOutput: false});

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
```

# License

MIT
