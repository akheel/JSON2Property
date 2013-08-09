#!/usr/bin/env node

var JSON2Property = require('../lib/json2property');

var program = require('commander');

program
  .version('1.0.0-alpha')
  .option('-t, --test', 'lol test option')
  .parse(process.argv);

new JSON2Property(program.args).read_directory();
