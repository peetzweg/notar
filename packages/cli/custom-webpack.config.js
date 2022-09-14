const { merge } = require('webpack-merge');
const ShebangPlugin = require('webpack-shebang-plugin');

module.exports = (config, context) => {
  return merge(config, {
    plugins: [new ShebangPlugin()],
  });
};
