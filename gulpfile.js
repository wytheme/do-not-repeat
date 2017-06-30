var gulp = require('gulp')
//var exec = require('child_process').execSync;
var shell = require('shelljs');

var conf = {
	watch: ['crud/*', '!crud/*.log', '!crud/*.jsx']
}

gulp.task('default', function(cb) {
	sh()

	var watcher = gulp.watch(conf.watch);
	watcher.on('change', function(event) {
		console.log('-----------> ')
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	  sh()

	});
})

function sh() {
	if (shell.exec('node crud/run.js').code !== 0) {
	  shell.echo('Error: Git commit failed');
	  // shell.exit(1);
	}
}

