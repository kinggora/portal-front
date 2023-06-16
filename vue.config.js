const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  outputDir: "../portal/src/main/resources/static",
  chainWebpack(config) {
    config.output.filename("js/[name].js");
  },
  transpileDependencies: true,
});
