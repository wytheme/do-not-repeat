var shelljs = require('shelljs')
var path = require('path')
var fs = require('fs')
// for template compiler
var ejs = require('ejs')
// for config
var yaml = require('js-yaml')
// for params
var argv = require('yargs').argv
// for log
var winston = require('winston');
winston.addColors({
  	// foo: 'blue',
    // bar: 'green',
    info: 'yellow',
    error: 'red'
  });

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  ],
  exitOnError: false,
});




logger.info('argv', argv)
// -------------------全局变量-----------------
const url = {
	tpl: path.resolve(__dirname, './view.ejs'),
	config: path.resolve(__dirname, './view.yml'),
	output: path.resolve(__dirname, './view.jsx'),
}

// -------------------读取本地配置-----------------
try {
  var conf = yaml.safeLoad(
    fs.readFileSync(url.config, 'utf8')
  );
  logger.debug(conf, conf.table, conf.modelName);
} catch (e) {
  logger.error(e);
}

// 1. 创建模块目录
shelljs.mkdir(path.resolve(__dirname, conf.parentName))

// 1. 获取文件输出路径
url.output = path.resolve(__dirname, conf.modelName + '/' +conf.modelName+'.'+conf.modelExtension)

// -------------------解析模板并输出文件-----------------
var people = ['geddy', 'neil', 'alex']
var html = ejs.renderFile(url.tpl, conf, {}, function(err, str) {
	logger.error(err)

	fs.writeFile(url.output, str, (err) => {
	  if (err) throw err;
	  logger.info('The file has been saved!');

	  //shelljs.cp(url.output, '/Users/lwz/Documents/htdocs/easemob/eva/src/app/pages/test')
	});
})






