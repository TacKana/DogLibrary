import { defineConfig } from 'eslint/config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default defineConfig(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          length: 200,
        },
      ],
      'no-var': 1, // 建议使用 let/const 替代 var
      'prefer-const': 1, // 建议使用 const 声明不变的变量
      'no-implicit-coercion': [1, { allow: ['!!'] }], // 禁止隐式类型转换
      eqeqeq: [2, 'always', { null: 'ignore' }], // 强制使用全等 (===) 运算符
      'linebreak-style': ['error', 'unix'],
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts',
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
)
