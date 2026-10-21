import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage';
import { MenuPage } from '../pages/MenuPage';
import { test, expect } from '../fixtures';



test.describe('Home - Navegación', () => {
  test.beforeEach(async () => {
    await allure.epic('Home');
    await allure.feature('Navegación principal');
  });

  test('El navbar muestra los 3 menús principales', async ({ page }) => {
    await allure.story('Navbar visible');
    await allure.severity('critical');

    const homePage = new HomePage(page);
    const menuPage = new MenuPage(page);

    await test.step('1. Abrir el home', async (step) => {
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.dismissWelcomeModalIfVisible();
      await step.attach('home-cargado.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('2. Verificar que los menús principales están visibles', async (step) => {
      await menuPage.expectNavbarVisible();
      await step.attach('navbar-visible.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });

  test('Navegar a Talento > Registro', async ({ page }) => {
    await allure.story('Navegación a Registro');
    await allure.severity('normal');

    const homePage = new HomePage(page);
    const menuPage = new MenuPage(page);

    await test.step('1. Abrir el home', async () => {
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.dismissWelcomeModalIfVisible();
    });

    await test.step('2. Ir a Talento > Registro', async (step) => {
      await menuPage.irARegistro();
      await expect(page).toHaveURL(/\/register/);
      await step.attach('registro-abierto.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });
});