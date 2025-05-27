/* eslint-env node */

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'operator-linebreak': 'off', // 禁用操作符必须换行的规则
    'max-len': ['error', { code: 200 }], // 增加最大行宽限制
    'implicit-arrow-linebreak': 'off',
    // 确保 ESLint 使用单引号
    quotes: ['error', 'single'],
    // 禁用与 Prettier 冲突的规则
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
  },
}
