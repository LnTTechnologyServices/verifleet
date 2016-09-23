module.exports = {
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'ng-annotate!babel'
    }, {
      test: /\.html$/,
      loader: 'raw'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(svg|woff|eot|ttf)$/,
      loader: 'file'
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass'
    }, ]
  }
}
