module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    <% if (useTypescriptFrontend || useTypescriptBackend) { %>
    '@typescript-eslint/recommended',
    <% } %>
    'prettier'
  ],
  <% if (useTypescriptFrontend || useTypescriptBackend) { %>
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint'
  ],
  <% } else { %>
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  <% } %>
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js'
  ]
}; 