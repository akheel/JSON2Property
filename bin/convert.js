#!/usr/bin/env node

var JSON2Property = require('../lib/json2property');

var program = require('commander');

program
  .version('0.0.1')
  .option('-t, --test', 'lol test option')
  .parse(process.argv);

new JSON2Property(program.args).read_directory();
