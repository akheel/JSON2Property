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
  .option('-i, --in <directory>', 'input directory', ".")
  .option('-o, --out <directory>', 'output directory', "./target")
  .option('-p, --pattern <pattern>', 'pattern to match (uses glob)', '/**/*.json')
  .parse(process.argv);


glob(program.in + "" + program.pattern, function(error, files){
  var i;
  var read_file;
  var path, file_name, last_slash;
  var errors = [];

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

  batch.concurrency(5);

  var process_file = function(file) {
    return function(done){
      read(file.path + file.file_name, function(err, data){
        file.contents = json2property.convert(JSON.parse(data));
        mkpath.sync(program.out + "/" + file.path);
        write(program.out + "/" + file.path + file.file_name.replace('.json', '.properties'), file.contents, function(err){
          if (err) errors.push(err);
          done(null, file);
          bar.tick();
        });
      });
    };
  };

  for (i = 0; i < files.length; i++) {
    batch.push(process_file(files[i]));
  }

  batch.end(function(err, results){
    console.log('\nTranscoding Complete');
    process.exit(0);
  });

});

var throw_error = function(error) {
  console.log(error);
  process.exit(1);
};


// new JSON2Property(program.args).read_directory();
