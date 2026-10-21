import { test as setup, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { OtpPage } from './pages/OtpPage';

const authFile = 'auth.json';

setup('Autenticación completa con OTP', async ({ page }) => {
  setup.setTimeout(300_000);

  const loginPage = new LoginPage(page);
  const otpPage = new OtpPage(page);

  console.log('\n🔐 Setup: iniciando autenticación...\n');

  await loginPage.goto();
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  await otpPage.expectLoaded();

  console.log('\n✋ Escribe el OTP en el navegador y pulsa Confirmar.\n');
  await otpPage.waitForManualLogin();

  // 💾 Guardar la sesión para reutilizarla
  await page.context().storageState({ path: authFile });

  console.log(`\n✅ Sesión guardada en ${authFile}\n`);
});