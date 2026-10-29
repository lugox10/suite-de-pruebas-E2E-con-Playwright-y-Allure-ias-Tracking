import { test, expect } from '../fixtures';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage';
import { MenuPage } from '../pages/MenuPage';
import { WorkshopsPage, DatosWorkshop } from '../pages/WorkshopsPage';

test.describe('Administración - Workshops', () => {
  
  test.beforeEach(async ({ page }) => {
    await allure.label('epic', 'Administración');
    await allure.label('feature', 'Módulo Workshops');

    const homePage = new HomePage(page);
    const menuPage = new MenuPage(page);
    const workshopsPage = new WorkshopsPage(page);

    await homePage.goto();
    await homePage.expectLoaded();
    await homePage.dismissWelcomeModalIfVisible();
    await menuPage.irAWorkshops();
    await workshopsPage.expectLoaded();
  });

  test('Filtrar workshops y validar etiquetas de las tarjetas', async ({ page }) => {
    await allure.label('story', 'Búsqueda y validación de UI');
    await allure.label('severity', 'critical');

    const workshopsPage = new WorkshopsPage(page);

    await test.step('1. Aplicar filtros de Tecnología y Speaker', async (step) => {
      await workshopsPage.abrirCalendarios();
      await workshopsPage.filtrarPorTecnologia('Java');
      await workshopsPage.filtrarPorSpeaker('Carlos Lugo');
      
      await step.attach('01-filtros-aplicados.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('2. Ejecutar búsqueda y validar etiquetas', async (step) => {
      await workshopsPage.buscar();
      await workshopsPage.expectTagsVisibles();
      
      await step.attach('02-resultados-con-etiquetas.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });

  test('Limpiar filtros de búsqueda', async ({ page }) => {
    await allure.label('story', 'Limpiar filtros');
    await allure.label('severity', 'normal');

    const workshopsPage = new WorkshopsPage(page);

    await test.step('1. Aplicar un filtro', async () => {
      await workshopsPage.filtrarPorTecnologia('Java');
    });

    await test.step('2. Limpiar los filtros', async (step) => {
      await workshopsPage.limpiarFiltros();
      
      await step.attach('03-filtros-limpios.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });

  test('Crear un nuevo workshop y verificarlo en la lista', async ({ page }) => {
    await allure.label('story', 'Crear workshop');
    await allure.label('severity', 'critical');

    const workshopsPage = new WorkshopsPage(page);

    const datos: DatosWorkshop = {
      titulo: 'PRUEBA DE AUTOMATIZACION, creacion del workshop',
      descripcion: 'esta prueba se hace para que quede automatizada la funcionalidad',
      dia: '21',
      hora: '6:00 PM',
      duracion: '1 hora',
      tecnologia: 'Java',
      speaker: 'Carlos Lugo'
    };

    await test.step('1. Abrir formulario y llenar datos', async (step) => {
      await workshopsPage.abrirFormularioCrear();
      await workshopsPage.llenarFormularioWorkshop(datos);
      
      await step.attach('04-formulario-creacion.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('2. Guardar y validar mensaje de éxito', async (step) => {
      await workshopsPage.guardarCreacion();
      await workshopsPage.expectCreacionExitosa();
      
      await step.attach('05-creacion-exitosa.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('3. Verificar que el workshop aparece en la lista', async (step) => {
      await page.getByRole('button', { name: 'Buscar' }).click();
      await page.waitForTimeout(1000);

      await expect(page.getByRole('heading', { name: datos.titulo })).toBeVisible();
      
      await step.attach('06-workshop-en-la-lista.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });

  test('Editar un workshop existente', async ({ page }) => {
    await allure.label('story', 'Editar workshop');
    await allure.label('severity', 'normal');

    const workshopsPage = new WorkshopsPage(page);

    await test.step('1. Buscar y abrir formulario de edición', async (step) => {
      await page.getByRole('button', { name: 'Buscar' }).click();
      await page.waitForTimeout(1000);
      
      await workshopsPage.abrirFormularioEditar();
      
      await step.attach('07-formulario-edicion.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });

    await test.step('2. Modificar datos y guardar', async (step) => {
      await workshopsPage.editarHorarioWorkshop('7:00 PM', '2 horas');
      await workshopsPage.guardarEdicion();
      await workshopsPage.expectEdicionExitosa();
      
      await step.attach('08-edicion-exitosa.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  });
});