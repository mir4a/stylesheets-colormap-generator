// const path = require('path');
//
// module.exports = {
//   entry: './public/es6/main.js',
//   output: {
//     path: __dirname,
//     filename: 'build.js'
//   },
//   module: {
//     loaders: [
//       {
//         test: path.join(__dirname, 'es6'),
//         loader: 'babel-loader',
//         query: {
//           presets: ['es2015']
//         }
//       }
//     ]
//   }
// };

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './public/es6/main.js',
  output: {
    path: path.join(__dirname, 'public/javascripts'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}