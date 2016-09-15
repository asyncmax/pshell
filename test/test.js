"use strict";

var npath = require("path");
var test = require("tape");
var shell = require("../lib");

shell.options.echoCommand = false;

var CAT = "node " + npath.join(__dirname, "fixture/cat.js");
var ERROR = "node " + npath.join(__dirname, "fixture/error.js");
var JSONJS = "node " + npath.join(__dirname, "fixture/json.js");
var ENV = "node " + npath.join(__dirname, "fixture/env.js");

test("basic echo test", function(t) {
  shell("echo test").then(function(res) {
    t.equal(res.code, 0);
    t.ok(!res.stdout);
    t.ok(!res.stderr);
  }).then(t.end, t.end);
});

test("stdout capture", function(t) {
  shell("echo stdout test", {captureOutput: true}).then(function(res) {
    t.equal(res.code, 0);
    t.equal(res.stdout, "stdout test\n");
    t.ok(!res.stderr);
  }).then(t.end, t.end);
});

test("stdout as JSON", function(t) {
  shell(JSONJS, {captureOutput: function(buf) {
    t.ok(Buffer.isBuffer(buf));
    return JSON.parse(buf.toString());
  }}).then(function(res) {
    t.equal(typeof res.stdout, "object");
    t.deepEqual(res.stdout, {
      type: "message",
      message: [
        "Hello",
        "world!"
      ]
    });
  }).then(t.end, t.end);
});

test("supplying stdin", function(t) {
  shell(CAT, {inputContent: "Hello!", captureOutput: true}).then(function(res) {
    t.equal(res.code, 0);
    t.equal(res.stdout, "Hello!");
    t.ok(!res.stderr);
  }).then(t.end, t.end);
});

test("stderr capture", function(t) {
  shell(CAT, {inputContent: "World\n", captureOutput: true, captureError: true}).then(function(res) {
    t.equal(res.code, 0);
    t.equal(res.stdout, "World\n");
    t.equal(res.stderr, "stderr test\n");
  }).then(t.end, t.end);
});

test("error exit rejection", function(t) {
  shell(ERROR).then(function(res) {
    t.fail("error exit didn't reject the promise");
  }, function(err) {
    t.pass("error exit rejected the promise");
  }).then(t.end, t.end);
});

test("ignoreError option", function(t) {
  shell(ERROR, {ignoreError: true}).then(function(res) {
    t.equal(res.code, 1234);
  }).then(t.end, t.end);
});

test("shell.spawn", function(t) {
  var res = shell.spawn("node", ["--version"], {captureOutput: true});
  t.ok(res.childProcess);
  t.ok(res.promise);
  res.promise.then(function(res) {
    t.equal(res.code, 0);
    t.ok(res.stdout);
  }).then(t.end, t.end);
});

test("shell.exec", function(t) {
  var res = shell.exec("echo hello", {captureOutput: true});
  t.ok(res.childProcess);
  t.ok(res.promise);
  res.promise.then(function(res) {
    t.equal(res.code, 0);
    t.equal(res.stdout, "hello\n");
  }).then(t.end, t.end);
});

test("shell.context", function(t) {
  var sh = shell.context({
    captureOutput: true,
    ignoreError: true
  });

  t.equal(sh.options.echoCommand, false, "should inherit parent's options");

  sh("echo hi!").then(function(res) {
    t.equal(res.code, 0);
    t.equal(res.stdout, "hi!\n");
    t.ok(!res.stderr);
    return sh(ERROR);
  }).then(function(res) {
    t.equal(res.code, 1234);
  }).then(t.end, t.end);
});

test("normalizeText option", function(t) {
  var options = {inputContent: "Hello\r\nWonderful\rWorld\n", captureOutput: true};
  shell(CAT, options).then(function(res) {
    t.equal(res.stdout, "Hello\nWonderful\nWorld\n");
    options.normalizeText = false;
    return shell(CAT, options);
  }).then(function(res) {
    t.equal(res.stdout, "Hello\r\nWonderful\rWorld\n");
    options.normalizeText = function(text) {
      return "[" + text.replace(/\n|\r/g, "") + "]";
    };
    return shell(CAT, options);
  }).then(function(res) {
    t.equal(res.stdout, "[HelloWonderfulWorld]");
  }).then(t.end, t.end);
});

test("stdio option", function(t) {
  shell("echo hello", {
    stdio: ["ignore", "pipe", "inherit"],
    captureOutput: true,  // should be ignored
    captureError: true    // should be ignored
  }).then(function(res) {
    t.equal(res.code, 0);
    t.ok(!res.stdout);
    t.ok(!res.stderr);
  }).then(t.end, t.end);
});

test("env option", function(t) {
  shell(ENV, {env: {MY_ENV_VAR: "haha"}, captureOutput: true}).then(function(res) {
    t.equal(res.stdout, "haha\n");
  }).then(t.end, t.end);
});

test("Promise option", function(t) {
  var P = require("es6-promise").Promise;

  var promise = shell("echo hello", {Promise: P, captureOutput: true});

  t.equal(promise.constructor, P);

  promise.then(function(res) {
    t.equal(res.stdout, "hello\n");
  }).then(t.end, t.end);
});
