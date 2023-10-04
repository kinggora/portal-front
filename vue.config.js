const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    client: {
      overlay: false,
    },
  },
  outputDir: "../src/main/resources/static",

  chainWebpack(config) {
    config.output.filename("js/[name].js");
  },

  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
