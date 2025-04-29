module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
          alias: {
            "@assets/*": "./assets",
            "@constants/*": "./constants",
            "@data/*": "./data",
            "@hooks/*": "./hooks",
            "@navigators/*": "./navigators",
            "@screens/*": "./screens",
            "@models/*": "./types",
            "@ui-components/*": "./ui-components",
            "@utils/*": "./utils",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
