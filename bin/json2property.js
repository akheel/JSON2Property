#!/usr/bin/env node


var json2property = require('../lib/json2property');
var glob = require('glob');
var write = require('fs').writeFile;
var read = require('fs').readFile;
var multimeter = require('multimeter');
var multi = multimeter(process);
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

  console.log("Found " + files.length + " files for transcoding.\n");

  var bar = multi.rel(0, 1, {
    width: 40
  });

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

  batch.concurrency(1);

  var process_file = function(file) {
    return function(done){
      read(file.path + file.file_name, function(err, data){
        file.contents = json2property.convert(JSON.parse(data));
        mkpath.sync(program.out + "/" + file.path);
        write(program.out + "/" + file.path + file.file_name.replace('.json', '.properties'), file.contents, function(err){
          if (err) errors.push(err);
          done(null, file);
        });
      });
    };
  };

  for (i = 0; i < files.length; i++) {
    batch.push(process_file(files[i]));
  }

  batch.on('progress', function(event){
    //console.log("Transcoding Item " + event.index + " of " + event.complete);
    bar.ratio(event.index, event.total, "Transcoding " + event.index + " / " + event.total );
  });

  batch.end(function(err, results){
    var length = results.length;
    bar.ratio(length, length, "Transcoding " + length + " / " + length);
    console.log('Transcoding Complete');
    process.exit(0);
  });

});

var throw_error = function(error) {
  console.log(error);
  process.exit(1);
};
