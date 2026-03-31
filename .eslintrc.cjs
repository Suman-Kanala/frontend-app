module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
  },
};
