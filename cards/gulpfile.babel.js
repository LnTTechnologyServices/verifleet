'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import sync     from 'run-sequence';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import replace  from 'gulp-replace';
import fs       from 'fs';
import yargs    from 'yargs';
import lodash   from 'lodash';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import del      from 'del';
import webpackDevMiddelware from 'webpack-dev-middleware';
import webpachHotMiddelware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';

let root = './';

// helper method for resolving paths
let resolveToCards = (glob = '') => {
  return path.join(root, 'cards', glob); // ./cards/{glob}
};

let resolveToComponents = (glob = '') => {
  return path.join(root, 'components', glob); // ./components/{glob}
};

let resolveToCore = (glob = '') => {
  return path.join(root, 'core', glob); // ./components/{glob}
};

// map of all paths
let paths = {
  js: [resolveToComponents('**/*!(.spec.js).js'), resolveToCore('**/*.!(.spec.js).js')], // exclude spec files
  scss: [resolveToCards('**/*.scss'), resolveToComponents('**/*.scss')],
  styl: [resolveToCards('**/*.styl'), resolveToComponents('**/*.styl')], // stylesheets
  output: root,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  dest: path.join(__dirname, 'dist')
};

// use webpack.config.js to build modules
gulp.task('webpack', ['clean'], (cb) => {
  const config = require('./webpack.dist.config');
  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));
    cb();
  });
});

gulp.task('watch', ['webpack'], () => {
  gulp.watch(['cards/**/*.*', 'components/**/*.*', 'core/**/*.*', 'exosite.js', './gulpfile.babel.js', '.babelrc', 'webpack.config.js'], ['webpack']);
});

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  var argv = yargs.usage('Usage: gulp component --name [string] -path [string]')
    .demand(['name','path'])
    .argv

  const name = argv.name;
  const targetPath = argv.path || '';
  const destPath = path.join(targetPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});

gulp.task('default', ['watch']);
