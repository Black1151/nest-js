const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  };
};

// const { composePlugins, withNx } = require('@nrwl/webpack');

// // Nx plugins for webpack.
// module.exports = composePlugins(withNx(), (config) => {
//   // Update the webpack config as needed here.
//   // e.g. `config.plugins.push(new MyPlugin())`
//   // watch for changes in the api folder and rebuild
//   config.watch = true;
//   config.watchOptions = {
//     ignored: /node_modules/,
//     aggregateTimeout: 300,
//     poll: 1000,
//   }

//   return config;
// });
