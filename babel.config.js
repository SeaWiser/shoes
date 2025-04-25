module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            '@ui-components': './ui-components',
            '@screens': './screens',
            '@constants': './constants',
            '@data': './data',
            '@hooks': './hooks',
            '@types': './types',
            '@navigators': './navigators',
          },
        },
      ],
    ],
  };
};
