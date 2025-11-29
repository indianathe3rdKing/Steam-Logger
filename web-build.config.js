// web-build.config.js
const { createExpoWebpackConfigAsync } = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Ensure font loading works properly
  if (config.module && config.module.rules) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
    });
  }

  return config;
};
