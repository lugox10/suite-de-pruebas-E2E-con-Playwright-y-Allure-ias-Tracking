import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Configuración de Playwright.
 * Ver https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  //  Carpeta donde están los tests
  testDir: './tests-tracking',

  // ⏱️ Timeout global por test: 3 minutos (180000 ms)
  // Sirve para que el OTP manual no caduque el test.
  timeout: 180_000,

  // ⏱️ Timeout para cada expect/toBeVisible
  expect: {
    timeout: 15_000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['allure-playwright', {
    detail: true,
    resultsDir: 'allure-results',
    suiteTitle: true,
  }],
],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',        // 📼 Graba la traza (DOM, red, consola) en el primer reintento
    screenshot: 'only-on-failure',  // 📸 Captura la pantalla solo cuando el test falla
    video: 'retain-on-failure',     // 🎥 Graba video y lo conserva solo si el test falla
  },

projects: [
  // 1. Setup: genera auth.json (pide OTP manual, una vez)
  {
    name: 'setup',
    testMatch: /auth\.setup\.ts/,
  },

  // 2. Login: NO usa auth.json, hace su propio login + OTP
  {
    name: 'login',
    testMatch: /login\.spec\.ts/,
    use: { ...devices['Desktop Chrome'] },
  },

  // 3. Módulos: usan auth.json, no piden OTP
  {
    name: 'modules',
    testIgnore: [/login\.spec\.ts/, /auth\.setup\.ts/],
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'auth.json',
    },
    dependencies: ['setup'],
  },
],
});