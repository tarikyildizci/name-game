module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb-typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'import/extensions': 0,
    '@typescript-eslint/no-unused-expressions': [1, { allowShortCircuit: true }],
    '@typescript-eslint/camelcase': 0,
    'no-shadow': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
}
