var path = require('path');
var webpack = require('webpack');

//node环境变量
var env = process.env.NODE_ENV;

var config = {
  entry: ['./index'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
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