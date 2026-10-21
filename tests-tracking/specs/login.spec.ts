import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OtpPage } from '../pages/OtpPage';
import { allure } from 'allure-playwright';

test('login con OTP manual', async ({ page }) => {
  // ⏱️ 5 minutos solo para este test (por el OTP manual)
  test.setTimeout(300_000);

  // 📊 Metadatos para el reporte de Allure
  await allure.epic('Autenticación');
  await allure.feature('Login');
  await allure.story('Login con OTP manual');
  await allure.severity('critical');
  await allure.description(
    'Valida el flujo de login: usuario + contraseña + OTP, hasta llegar al dashboard.'
  );

  const loginPage = new LoginPage(page);
  const otpPage = new OtpPage(page);

  await test.step('1. Abrir el sitio y verificar pantalla de login', async (step) => {
    await loginPage.goto();
    await expect(
      page.getByRole('heading', { name: 'Bienvenido a IAS Tracking' })
    ).toBeVisible();

    // 📸 Evidencia adjunta al paso
    const shot = await page.screenshot();
    await step.attach('01-pantalla-login.png', {
      body: shot,
      contentType: 'image/png',
    });
  });

  await test.step('2. Ingresar credenciales (usuario + contraseña)', async (step) => {
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

    const shot = await page.screenshot();
    await step.attach('02-credenciales-ingresadas.png', {
      body: shot,
      contentType: 'image/png',
    });
  });

  await test.step('3. Verificar pantalla de OTP', async (step) => {
    await otpPage.expectLoaded();

    const shot = await page.screenshot();
    await step.attach('03-pantalla-otp.png', {
      body: shot,
      contentType: 'image/png',
    });
  });

  await test.step('4. Usuario ingresa OTP manualmente', async (step) => {
    await otpPage.waitForManualLogin();

    const shot = await page.screenshot();
    await step.attach('04-dashboard-cargado.png', {
      body: shot,
      contentType: 'image/png',
    });
  });

  await test.step('5. Validar que se entró al dashboard', async (step) => {
    await expect(page.locator('.menu-user-name')).toBeVisible();
    await expect(page.locator('.menu-user-name')).toContainText('Andres Lugo');

    const shot = await page.screenshot();
    await step.attach('05-usuario-validado.png', {
      body: shot,
      contentType: 'image/png',
    });
  });
});