#!/usr/bin/env node


var json2property = require('../lib/json2property');
var glob = require('glob');
var write = require('fs').writeFile;
var read = require('fs').readFile;
var ProgressBar = require('progress');
var program = require('commander');
var Batch = require('batch');
var batch = new Batch();
var mkpath = require('mkpath');

program
  .version('1.0.0-alpha')
  .option('-i, --in <directory>', 'input directory', process.cwd())
  .option('-o, --out <directory>', 'output directory', process.cwd())
  .option('-p, --pattern <pattern>', 'pattern to match (uses glob)', '/**/*.json')
  .parse(process.argv);


glob(program.in + "" + program.pattern, function(error, files){
  var i;
  var read_file;
  var path, file_name, last_slash;

  console.log(files);

  if (error) { throw_error(error); }
  files = files.map(function(file){
    last_slash = file.lastIndexOf("/");
    path = file.slice(0, last_slash + 1);
    file_name = file.slice(last_slash + 1);
    if (last_slash === -1) {
      path = "";
      file_name = file;
    }
    return { path: path, file_name: file_name };
  });

  var bar = new ProgressBar("Transcoding item :current of :total [:bar] :percent, :etas",
    {
      total: files.length,
      complete: '=',
      incomplete: '-',
      width: 40
  });


});

var process_files = function(error, files) {
  if (error) { throw_error(error); }

  console.log("process_files = ", files);
};

var throw_error = function(error) {
  console.log(error);
  process.exit(1);
};


// new JSON2Property(program.args).read_directory();
