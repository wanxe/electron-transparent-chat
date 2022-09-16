module.exports = {
  root: true,
  ignorePatterns: ['*.d.ts'],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
  ],
  rules: {
    'no-console': 'off',
    curly: 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'only-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'import/no-named-as-default': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-indent': ['error', 2],
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': [2, {
      singleline: {
        max: 2,
      },
      multiline: {
        max: 1,
      },
    }],
    'vue/script-indent': ['warn', 2, {
      baseIndent: 0,
    }],
    'array-bracket-spacing': ['error', 'never'],
    semi: ['error', 'always'],
    'template-curly-spacing': 'off',
    indent: ['error', 2, { ignoredNodes: ['TemplateLiteral'] }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'only-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
  },
};
