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
- More portable (don't leave Windows users behind).
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

> Configure the global options so you don't need to specify the same options every time.

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

### shell.options

An object represents the base options to be applied to every session executed from this context. You can modify fields of this object to change the default behavior.

### shell.context([options])

Creates a new `shell()` function that is pre-configured with the specified options (combined with the current base options).

### shell.spawn(exec[, args[, options]])

Executes a child process specified in `exec` directly without the system shell layer. `args` is an array of string arguments to be given to the process. Returns an object `{childProcess, promise}`. See [`ChildProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess) for more details about Node's underlying child process object.

This is the base method for implementing `shell()` and `shell.exec()`.

```js
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
```

### shell.exec(command[, options])

Same as `shell()` but returns an object `{childProcess, promise}` instead of a promise. Primary reason that you might want to use this function instead of `shell()` is probably to access the child process object for advanced use cases. However, keep in mind that the child process object returned by this method represents the system shell process, not the command process.

Calling `shell(cmd, opts)` is same as calling `shell.exec(cmd, opts).promise`.

# Options

### options.Promise (default: `null`)

A `Promise` constructor to use instead of the system default one.

### options.echoCommand (default: `true`)

If truthy, prints the command string to the console. If you specify a function, it gets called like `func(exec, args)` with `this` set to the options object. If you return `false` from the function, the command is not executed. `childProcess` and the result object of the promise are `null` in this case.

### options.ignoreError (default: `false`)

If truthy, a non-zero exit code doesn't reject the promise so you can continue to the next steps.

### options.captureOutput (default: `false`)

If truthy, `stdout` of the child process is captured as a string in `res.stdout`. If falsy, it is printed to the parent's `stdout`. If you specify a function, it gets called like `func(buf)` with `this` set to the options object. `buf` is an instance of `Buffer` containing the captured content. The return value from this function is set to `res.stdout`. You can use this feature for advanced use cases such as handling custom character encoding or parsing JSON.

```js
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
```

### options.captureError (default: `false`)

If truthy, 'stderr' of the child process captured as a string in `res.stderr`. You can specify a function as in `captureOutput` options.

### options.normalizeText (default: `true`)

If truthy, the end of line characters in a captured string are normalized to `"\n"`. Only used when capturing to a string is enabled (by `options.captureOutput` and/or `options.captureError`).

### options.inputContent (default: `null`)

You can specify a string or an instance of `Buffer` to supply the input data to `stdin` of the child process.

### Node's `child_process.spawn()` options

In addition to the proprietary options above, the following options of [`child_process.spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) also work.

- cwd
- env
- arg0
- stdio (if specified, `inputContent`, `captureOutput` and `captureError` options are ignored)
- detached
- uid
- gid

# Result object

This objects is given as a value when the promise returned by one of execution functions is resolved.

### res.code (number)

The exit code of child process.

### res.stdout (string or any)

The captured `stdout` of child process. This field exists only when `options.captureOutput` is truthy. This is a string value by default but you can override its behavior with your own custom handler. 

### res.stderr (string or any)

The captured `stderr` of child process. This field exists only when `options.captureError` is truthy. This is a string value by default but you can override its behavior with your own custom handler. 

# Develop & contribute

## Setup

```sh
git clone https://github.com/asyncmax/pshell
cd pshell
npm install
npm run lint  # run lint
npm test      # run test
```

## Coding style

- Use two spaces for indentation.
- Use double quotes for strings.
- Use ES5 syntax for lib & test.

# License

MIT
