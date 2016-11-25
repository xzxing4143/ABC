var path = require('path');
console.dir(path);
console.log('__dirname==='+__dirname);
module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}