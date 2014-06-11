module.exports = {

  convert: function(json) {
    var i;
    var content = "";

    for (i in json) {
      if(typeof json[i] === 'object'){
        parseJsonObj(i , json[i], function myCallback(error, data){
          content += data;
        });
      } else {
        content += i + "=" + (json[i] + "").replace(/\n/g, '') + "\r\n";
      }
    }

    return content;
  }

};

function parseJsonObj(key, value, cb){
  var j;
  for (j in value) {
    if(typeof value[j] === 'object'){
      parseJsonObj(key +"."+ j, value[j], cb);
    } else {
      cb(null, key +"."+ j + "=" + (value[j] + "").replace(/\n/g, '') + "\r\n");
    }
  }
}

