#!/usr/bin/env node

console.log(`Hello YX!`)

var yaml = require('js-yaml')
var fs = require('fs')
var argv = require('yargs').argv

console.log(argv)

try {
  var doc = yaml.safeLoad(
    fs.readFileSync('./config.yml', 'utf8')
  );
  console.log(doc, doc.config[1]);
} catch (e) {
  console.log(e);
}