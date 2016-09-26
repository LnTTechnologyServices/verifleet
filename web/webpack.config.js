var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //devtool: 'sourcemap',
    name: 'browser',
    entry: {
        "app": ['babel-polyfill', "./client/app/app"],
        "css": ['exosite-pcc/style/icons/icons.css', 'normalize.css', 'angular-material/angular-material.css'],
        "highcharts": ["highcharts-ng", "./client/app/vendor/highstock", "./client/app/vendor/solid-gauge", "./client/app/vendor/highcharts-more"],
        //"leaflet": ["leaflet", "ui-leaflet", "leaflet.markercluster", "angular-simple-logger"],
        "auth0": ["auth0-lock", "auth0-angular"],
        "moment": ["moment", "angular-moment"],
        "angular": ["angular", "angular-ui-router", "angular-material", "angular-jwt", "angular-storage", "angular-material-icons", "angular-aria", "angular-animate", 'ng-redux']
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.styl$/, loader: 'style!css!stylus' },
            { test: /\.css$/, loader: 'style!css!' },
            { test: /\.scss$/, loader: 'style!css!sass' },
            { loader: 'exports?window.angular', test: require.resolve('angular') },
            { test: /node_modules[\\\/]auth0-lock[\\\/].*\.js$/, loaders: ['transform-loader/cacheable?brfs', 'transform-loader/cacheable?packageify'] },
            { test: /node_modules[\\\/]auth0-lock[\\\/].*\.ejs$/, loader: 'transform-loader/cacheable?ejsify' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.jpg$/, loader: 'file' },
            { test: /\.png$/, loader: 'file' },
            { test: /\.(svg|woff|eot|ttf|otf)$/, loader: 'file' }
        ]
    },
    plugins: [
        // Injects bundles in your index.html instead of wiring all manually.
        // It also adds hash to all injected assets so we don't have problems
        // with cache purging during deployment.

        new webpack.ProvidePlugin({
            "window.Auth0Lock": "auth0-lock",
            "moment": "moment",
            "_": "lodash"
        }),
        new HtmlWebpackPlugin({
            template: 'client/index.html',
            favicon: "client/favicon.ico",
            inject: 'body',
            hash: true,
        }),
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.optimize.AggressiveMergingPlugin(),
        /*new webpack.optimize.CommonsChunkPlugin({
          name: "angular",
          filename: "angular.bundle.js",
          chunks: ["app", "angular", "angular-ui-router", "angular-material", "angular-material-icons", "angular-aria", "angular-animate"],
          minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: "moment",
          filename: "moment.bundle.js",
          chunks: ["app", "moment", "angular-moment"],
          minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: "auth0",
          filename: "auth0.bundle.js",
          chunks: ["app", "auth0-lock", "auth0-angular", "angular-jwt", "angular-storage"],
          minChunks: Infinity
        }),*/

        //"highcharts": ["./client/app/vendor/highstock", "./client/app/vendor/solid-gauge","./client/app/vendor/highcharts-more"],
        //"leaflet": ["leaflet", "ui-leaflet", "leaflet.markercluster", "angular-simple-logger"],

        new webpack.optimize.CommonsChunkPlugin({
            names: ["highcharts", "moment", "auth0", "css", "angular"],
            filename: '[name].bundle.js'
        }),

        //new webpack.optimize.DedupePlugin(),
        /*new webpack.optimize.UglifyJsPlugin({
          mangle: {
            // You can specify all variables that should not be mangled.
            // For example if your vendor dependency doesn't use modules
            // and relies on global variables. Most of angular modules relies on
            // angular global variable, so we should keep it unchanged
            except: ['$super', '$', 'exports', 'require', 'angular']
          },
          sourceMap: false
        }),*/

        // Automatically move all modules defined outside of application directory to vendor bundle.
        // If you are using more complicated project structure, consider to specify common chunks manually.
        //new webpack.optimize.CommonsChunkPlugin({
        //  name: 'vendor',
        //  minChunks: function (module, count) {
        //    return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
        //  }
        //}),

    ],
    node: {
        fs: 'empty',
        tls: 'empty'
    }
};