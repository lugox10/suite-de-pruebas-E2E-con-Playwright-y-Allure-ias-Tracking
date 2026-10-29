import { test } from '../fixtures';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage';
import { MenuPage } from '../pages/MenuPage';
import { RegistroTalentoPage, DatosTalento } from '../pages/RegistroTalentoPage';

test.describe('Módulo Talento - Registro', () => {
  test.beforeEach(async () => {
    await allure.label('epic', 'Gestión de Talento');
    await allure.label('feature', 'Registro de Talento');
  });

  test('Abrir el formulario de registro y verificar campos', async ({ page }) => {
    await allure.label('story', 'Formulario visible');
    await allure.label('severity', 'critical');

    const homePage = new HomePage(page);
    const menuPage = new MenuPage(page);
    const registroPage = new RegistroTalentoPage(page);

    await test.step('1. Ir a Talento > Registro', async () => {
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.dismissWelcomeModalIfVisible();
      await menuPage.irARegistro();
      await registroPage.expectLoaded();
    });

    await test.step('2. Capturar formulario vacío', async (step) => {
      await step.attach('formulario-vacio.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });

  test('Crear un talento con datos válidos', async ({ page }) => {
    await allure.label('story', 'Crear talento');
    await allure.label('severity', 'critical');

    const homePage = new HomePage(page);
    const menuPage = new MenuPage(page);
    const registroPage = new RegistroTalentoPage(page);

    const datos: DatosTalento = {
      nombre: 'Test Automatizado QA',
      correo: `qa.auto.${Date.now()}@ias.com.co`,
      cargo: 'Analista de Calidad',
      cliente: 'Bancolombia',
      tutor: 'Carlos Lugo',
      notas: 'Talento creado desde prueba automatizada',
      tecnologias: ['Java'],
    };

    await test.step('1. Ir a Talento > Registro', async () => {
      await homePage.goto();
      await homePage.expectLoaded();
      await homePage.dismissWelcomeModalIfVisible();
      await menuPage.irARegistro();
      await registroPage.expectLoaded();
    });

    await test.step('2. Llenar formulario', async (step) => {
      await registroPage.llenarFormulario(datos);
      await step.attach('formulario-lleno.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('3. Crear talento', async (step) => {
      await registroPage.crear();
      await registroPage.expectCreacionExitosa();
      await step.attach('talento-creado.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });
});