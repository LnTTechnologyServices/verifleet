var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');

config.output = {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'client')
};

module.exports = config;
