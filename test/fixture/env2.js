"use strict";

console.log(process.env.MY_ENV_VAR1);
console.log(process.env.MY_ENV_VAR2);
console.log(process.env.MY_ENV_VAR3);

if (Object.keys(process.env).length <= 3)
  process.exit(1);
