module.exports = {

  convert: function(json) {
    var i;
    var content = "";

    for (i in json) {
      content += i + "=" + (json[i] + "").replace(/\n/g, '') + "\r\n";
    }

    return content;
  }

};
