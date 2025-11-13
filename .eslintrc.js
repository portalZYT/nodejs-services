module.exports = {
  extends: 'eslint-config-egg',
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'no-unused-vars': [ 'error', { argsIgnorePattern: '^_' }],
    'comma-dangle': [ 'error', 'always-multiline' ],
  },
};
