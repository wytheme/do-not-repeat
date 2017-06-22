var ejs = require('ejs')
var path = require('path')
var fs = require('fs')
var yaml = require('js-yaml')
var argv = require('yargs').argv

console.log(argv)
// -------------------全局变量-----------------
const url = {
	tpl: path.resolve(__dirname, './view.ejs'),
	config: path.resolve(__dirname, './view.yml'),
	output: path.resolve(__dirname, './view.jsx')
}

// -------------------读取本地配置-----------------
try {
  var conf = yaml.safeLoad(
    fs.readFileSync(url.config, 'utf8')
  );
  console.log(conf, conf.table, conf.modelName);
} catch (e) {
  console.log(e);
}

// -------------------解析模板并输出文件-----------------
var people = ['geddy', 'neil', 'alex']
var html = ejs.renderFile(url.tpl, {modelName:conf.modelName}, {}, function(err, str) {
	// console.log(err, str)

	fs.writeFile(path.resolve(__dirname, conf.modelName+'.'+conf.modelExtension), str, (err) => {
	  if (err) throw err;
	  console.log('The file has been saved!');
	});
})






