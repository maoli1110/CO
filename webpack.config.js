var path = require('path');
var webpack = require('webpack');

//node环境变量
var env = process.env.NODE_ENV;

var config = {
  entry: {
    script: './script.js',
    css: './css.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  devtool:'sourcemap',
  plugins: [],
  module: {
    loaders: [{
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    },
    {
      test: '/\.html$/',
      loader:'raw'
    }]
  }
};

//压缩去comment
// if (env === 'production') {
//   config.plugins = config.plugins.concat(
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.optimize.OccurenceOrderPlugin()
//   );
// }

module.exports = config;