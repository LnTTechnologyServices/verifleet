var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  //devtool: 'source-map',
  entry: {
    exosite: ['./exosite.js'],
    vendor: ['angular', 'moment']
  },
  module: {
    loaders: [
       { test: /\.js$/, exclude: [/node_modules/], loader: 'ng-annotate!babel' },
       { test: /\.html$/, loader: 'raw' },
       { test: /\.styl$/, loader: 'style!css!stylus' },
       { test: /\.css$/, loader: 'style!css' },
       { test: /\.scss$/, loader: 'style!css!sass' },
       { test: /\.(svg|woff|eot|ttf)$/, loader: 'file-loader' },
       { test: /[\/]angular\.js$/, exclude: [/node_modules/], loader: 'exports?angular'}
    ]
  },
  plugins: [

    /*new webpack.ProvidePlugin({
        "window.moment": "moment",
        "window._": "lodash"
    }),*/

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    /*new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource &&
               module.resource.indexOf(path.resolve(__dirname, 'cards')) === -1 &&
               module.resource.indexOf(path.resolve(__dirname, 'components')) === -1 &&
               module.resource.indexOf(path.resolve(__dirname, 'core')) === -1;
      }
    })*/
  ]
};
