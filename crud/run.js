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
	config: path.resolve(__dirname, './run.yml'),
  output: [
    {
      tpl: path.resolve(__dirname, './View.ejs'),
      ext: '.jsx'
    },
    {
      tpl: path.resolve(__dirname, './View.model.ejs'),
      ext: '.model.js'
    },
    {
      tpl: path.resolve(__dirname, './ViewEditModal.ejs'),
      ext: 'EditModal.jsx'
    }
  ],
  // todo
  targetPath: ''
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

// console.log(conf.table.editFields)

url.targetPath = conf.targetPath

// 1. 创建模块目录
shelljs.mkdir(path.resolve(__dirname, conf.parentName))

// -------------------解析模板并输出文件-----------------

function renderAndOutput(tpl, output, targetPath) {
  targetPath = !targetPath && (targetPath = url.targetPath)
  let html = ejs.renderFile(tpl, conf, {}, function(err, str) {
    logger.error(err)

    fs.writeFile(output, str, (err) => {
      if (err) throw err;
      logger.info('--------------- saved! ----------------');
      logger.info(`tpl   : ${tpl}`)
      logger.info(`output: ${output}`)
      logger.info(`copy to`)

      targetPath && shelljs.cp(output, targetPath)
      targetPath && logger.info(`targetPath: ${targetPath}`)
    });
  })
}


url.output.forEach(function(o) {
  let output = path.resolve(__dirname, conf.parentName + '/' +conf.modelName+o.ext)
  renderAndOutput(o.tpl, output)
})




