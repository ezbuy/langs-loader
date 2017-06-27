var fs = require("fs");
var path = require("path");
var qs = require("querystring");
var loaderUtils = require('loader-utils');
var po2json = require("po2json");

var getFileCode = (filename) => {
	const nameArr = filename.split(".");
	return nameArr[nameArr.length - 2];
}

module.exports = function(source) {
	this.cacheable && this.cacheable();
	var resourcePath = this.resourcePath;
	var options = loaderUtils.getOptions(this);

	if(typeof options.code !== "undefined" || (typeof options.isLoadAll !== "undefined" && options.isLoadAll)){
		var resourceDir = path.dirname(resourcePath);

		if(typeof options.code !== "undefined"){
			var poPathname = path.join(resourceDir,path.basename(resourcePath,path.extname(resourcePath)))+"."+options.code+".po";
			return po2json.parse(fs.readFileSync(poPathname),options);
		}

		if (typeof options.isLoadAll !== "undefined" && options.isLoadAll) {
			var jsonData = {allResources: true};
			files = fs.readdirSync(resourceDir).filter((path)=>path.endsWith(".po"));

			for(var i=0;i<files.length;i++){
				var fileName = files[i];
				var fileCode = getFileCode(files[i]);
				if(typeof fileCode !== "undefined"){
					var filePath = path.join(resourceDir,fileName);
					this.addDependency(filePath);
					jsonData[fileCode] = po2json.parse(fs.readFileSync(filePath),options);
				}
			}
			return jsonData;
		}
	}

	return po2json.parse(source, options);
}
