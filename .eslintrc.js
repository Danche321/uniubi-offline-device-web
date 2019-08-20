module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true // 允许v-for v-if一起使用
    }],
    'vue/no-parsing-error': [2, {
      "x-invalid-end-tag": false // 允许不常规的闭合标签</br>
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
