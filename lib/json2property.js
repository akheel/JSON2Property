var file_system = require('fs');
var glob = require('glob');

var JSON2Property = function(args) {
  console.log("Args = ", args);
  this.args = null;

  this.running_location = args[0];

  if (this.running_location) {
    try {
      process.chdir(this.running_location);
    } catch (exception) {
      switch (exception.errno) {
        case 34:
          this.throw_error("No such file or directory found");
          break;
      }
    }

  }

  if (!file_system.existsSync('./target')) {
    file_system.mkdirSync('./target');
  }
};

JSON2Property.prototype.process_input = function(error, files) {
  var hierarchy;
  var file_name;
  var content;
  var path;
  var i, j;
  var temp_files = [];

  if (error) { JSON2Property.prototype.throw_error(error); }
  for (i = 0; i < files.length; i++){

    hierarchy = files[i].split('/');
    file_name = hierarchy.pop().replace(".json", "");
    path = "";
    if (hierarchy.length > 0) {
      for (j = 0; j < hierarchy.length; j++) {
        if (!file_system.existsSync("./target/" + path + hierarchy[j])) {
          file_system.mkdirSync("./target/" + path + hierarchy[j]);
        }
        path += hierarchy[j] + "/";
      }
    }
    content = JSON.parse(file_system.readFileSync(files[i]));
    temp_files.push({ "path": path, "file_name": file_name, "content": content });
  }

  for (i = 0; i < temp_files.length; i++) {
    content = "";
    for (j in temp_files[i].content) {
      content += j + "=" + temp_files[i].content[j] + "\r\n";
    }
    file_system.writeFileSync('./target/' + temp_files[i].path + temp_files[i].file_name + ".properties", content);
  }
  console.log("Finished Converting JSON for great justice!");
};

JSON2Property.prototype.read_directory = function() {
  console.log("About to convert some JSON in " + process.cwd() + " for great justice!");
  glob("**/*.json", {}, this.process_input);
};

JSON2Property.prototype.throw_error = function(error){
  var joke_messaging = [
    "You broke the internet: ",
    "You have set us up the bomb: "
  ];

  var the_choosen_one = Math.floor((Math.random() * joke_messaging.length));
  console.log(joke_messaging[the_choosen_one], error);
  process.exit(1);
};

module.exports = JSON2Property;
