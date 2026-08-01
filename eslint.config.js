import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  skipFormatting,

  {
    rules: {
      // Vue-specific rules
      'vue/attribute-hyphenation': 'error',
      'vue/html-quotes': 'error',
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-indent': 'error',
      'vue/max-attributes-per-line': 'error',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/multiline-html-element-content-newline': 'error',
      'vue/mustache-interpolation-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/singleline-html-element-content-newline': 'error',

      // Base JS/TS rules
      'comma-dangle': ['error', 'only-multiline'],
      'arrow-parens': ['error', 'as-needed'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'semi': 'error',
      'quotes': ['error', 'single'],
      'object-curly-spacing': ['error', 'always'],

      // Optional rules
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'max-len': ['warn', { code: 100, ignoreUrls: true }],
    },
  },
];
