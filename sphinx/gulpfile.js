var gulp = require('gulp');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var runSequence = require('run-sequence');
var mocha = require("gulp-spawn-mocha");
var argv = require('yargs').argv;
var glob = require("glob")

function shell(command, cb) {
  exec(command, (err, stdout, stderr) => {
    if(err) {
      console.log("Error: ", err)
    }
    console.log(stdout);
    console.log(stderr);
    if(cb) {
      cb(err);
    }
  });
}

// run the task, then run the tests - needs to be done this way to ensure first task finishes
// before the test starts
gulp.task('deploy_test', ['deploy'], function() { gulp.start('test') })
gulp.task('modules_test', ['upload_modules'], function() { gulp.start('test') })
gulp.task('api_test', ['upload_api'], function() { gulp.start('test') })
gulp.task('eventhandler_test', ['upload_eventhandler'], function() { gulp.start('test') })

gulp.task('deploy', function(cb) {
  console.log("Deploying API to sphinx.")
  shell("exosite --deploy", cb);
})

gulp.task('upload_eventhandler', function(cb) {
  console.log("Updating event handler...")
  shell('exosite --upload_eventhandler', cb)
})

gulp.task('upload_api', function(cb) {
  console.log("Updating api...")
  shell('exosite --upload_api', cb)
})

gulp.task('upload_modules', function(cb) {
  console.log("Updating modules...")
  shell('exosite --upload_modules', cb)
})

gulp.task('upload_static', function(cb) {
  console.log("Updating static files...")
  shell('exosite --upload_static', cb)
})

// TODO GULPFILE: this is duplicately named, and running `gulp deploy` does not work as intended
gulp.task('deploy_test', function(cb) {
  console.log("deploying...")
  shell('exosite --deploy', cb)
})

gulp.task('watch', function() {
  console.log("Watching files for changes...")
  // if we ran `gulp test` then run the tests once and exit
  // otherwise, monitor event_handler/ api/ modules/ dist/ test/*.spec.ts and any solutionfile changes
  if(argv.test) {
    watch('test/*.spec.ts', {ignoreInitial: true}, function(cb) { gulp.start('test') })
  } else {
    watch('event_handler/', {ignoreInitial: true}, function(cb) { gulp.start('eventhandler_test') })
    watch('api/', {ignoreInitial: true}, function(cb) { gulp.start('api_test') })
    watch('modules/', {ignoreInitial: true}, function(cb) { gulp.start('modules_test') })
    watch('dist/', {ignoreInitial: true}, function(cb) { gulp.start('upload_static') })    
    watch('test/*.spec.ts', {ignoreInitial: true}, function(cb) { gulp.start('test') })
    watch('./*Solutionfile*', {ignoreInitial: true}, function(cb) { gulp.start('deploy_test') })
  }
});

gulp.task('compile', (cb) => {
  if(argv.typescript) {
    return shell("./node_modules/.bin/tsc --sourcemap --module commonjs ./test/*.ts", cb)
  } else {
    cb();
  }

})

gulp.task('test', ['compile'], () => {
  glob('./test/*.js', function(err, files) {
    if(files.length == 0 && !argv.typescript) {
      console.log("No JS files found in test/*.js. You can enable TypeScript compilation with `gulp --typescript`")
    }
  })

  // focus test modules by passing in `gulp --service --user --device --ws`
  srcFiles = [];
  if(argv.user || argv.users) {
      srcFiles.push('./test/user.spec.js')
  }
  if(argv.device || argv.devices) {
    srcFiles.push('./test/device.spec.js')
  }
  if(argv.ws || argv.websocket) {
    srcFiles.push('./test/websocket.spec.js')
  }
  if(srcFiles.length == 0) {
    srcFiles = './test/*.spec.js'
  }

  if(argv.watch) {
    delete argv.watch;
    gulp.src(srcFiles, {read: false})
      .pipe(mocha({}));
    return watch('test/*.spec.ts', function(cb) { gulp.start('test') })
  } else {
    return gulp.src(srcFiles, {read: false})
      .pipe(mocha({}));
  }
});



gulp.task('deploy', function(cb) {
  runSequence('initialize', ['deploy'], 'test', cb);
});

gulp.task('initialize', function() {
  // if test files aren't there, tell user they can pass in `gulp --typescript` to autocompile when tests change
  glob('./test/*.js', function(err, files) {
    if(files.length == 0 && !argv.typescript) {
      console.log("No JS files found in test/*.js. You can enable TypeScript compilation with `gulp --typescript`")
    }
  })
  // if there is no .Solutionfile.secret, exit since we can't do anything w/ the API (you could run tests)
  glob('./.Solution*', function(err, files) {
    if(files.length == 0) {
      console.log("No Solutionfile secret found. Please run `exosite --init`.")
    } else {
      gulp.start('watch');
    }
  })

})

// running `gulp` will lead you to initialize
gulp.task("default", ["initialize"])
