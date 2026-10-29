import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'allure-report/', 'allure-results/', 'playwright-report/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests-tracking/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'off',

      // Dentro del bloque de "rules" que ya tienes, agrega:
      'playwright/expect-expect': 'off',
      'playwright/no-force-option': 'off', // Para quitar los warnings del force:true en PrimeNG
    },
  }
);