var fs = require("fs");
var path = require("path");
var qs = require("querystring");


module.exports = function(source) {
	this.cacheable && this.cacheable();
	var resourcePath = this.resourcePath;
	var query = qs.parse(this.query.slice(1));
	if (typeof query.code === "undefined" ) {
		return source;
	}
	var suffix = query.code;
	var callback = this.async();
	var extname = path.extname(resourcePath);
	var newResourcePath = resourcePath.replace(extname,"."+suffix+extname);

	if(!callback) {
		return fs.readFileSync(newResourcePath);
	}

	fs.readFile(newResourcePath,function(error, content){
		if(error) return callback(error);
		callback(null,content);
	});
}
