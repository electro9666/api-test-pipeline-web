const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: require('craco-plugin-scoped-css'),
    },
    {
      plugin: CracoAlias,
      options: {
        source: "jsconfig",
        jsConfigPath: "jsconfig.paths.json",
      },
    }
  ]
};