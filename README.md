# pshell

Provides a simple Promise-based interface for running shell commands.

# Basic usage

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

# Why?

Writing a shell script in JavaScript is:

- Easier than bash script to most developers.
- More portable (don't let Windows users behind).
- More powerful in managing child processes in asynchronous way.

# More details

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
var shell = require("pshell").context({echoCommand: false, captureOutput: true});

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

> A non-zero exit code rejects the promise by default.

```js
var shell = require("pshell").context({echoCommand: false});

// Using double quotes here is intentional. Windows shell supports double quotes only.
shell('node -e "process.exit(1)"').then(res => {
  console.log("exit code:", res.code);
}).catch(err => {
  console.error("error occurred:", err.message);
});

/****** console output *******
 error occurred: [Error: Process 26546 exited with code 1]
******************************/
```

> Set `ignoreError` to `true` if you want to get the promise resolved instead.

```js
var shell = require("pshell").context({echoCommand: false, ignoreError: true});

// Using double quotes here is intentional. Windows shell supports double quotes only.
shell('node -e "process.exit(1)"').then(res => {
  console.log("exit code:", res.code);
}).catch(err => {
  console.error("error occurred:", err.message);
});

/****** console output *******
 exit code: 1
******************************/
```

# API

### shell(command[, options])

Executes the `command` string using the system's default shell (`"/bin/sh"` on Unix, `"cmd.exe"` on Windows). An optional `options` object can be given to override the base options for this session.

Returns a promise that will be resolved with the [result object](#result-object) when the command execution completes.

### shell.exec(command[, options])

Same as `shell()` but returns an object `{childProcess, promise}` instead of a promise. Primary reason that you might want to use this function instead of `shell()` is probably to access the underlying [`ChildProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess) object for an advanced use case. However, keep in mind that the child process object represents the system shell process, not the command process.

Calling `shell(cmd, opts)` is same as calling `shell.exec(cmd, opts).promise`.

### shell.spawn(exec[, args[, options]])

Executes a child process specified in `exec` directly without the system shell layer. `args` is an array of string arguments to be given to the process. Returns an object `{childProcess, promise}`.

This is the underlying base method for implementing `shell()` and `shell.exec()`.

# Options

Options

# Result object

Result

# License

MIT
