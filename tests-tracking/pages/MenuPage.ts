import { Page, Locator, expect } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuInicio: Locator;
  readonly menuAdministracion: Locator;
  readonly menuTalento: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuInicio = page.getByRole('link', { name: /Inicio/ });
    this.menuAdministracion = page.getByRole('link', { name: /Administración/ });
    this.menuTalento = page.getByRole('link', { name: /Talento/ });
  }

  // Submenús de Administración
  async irARutaDeAprendizaje() {
    await this.menuAdministracion.click();
    await this.page.getByRole('link', { name: /Ruta de aprendizaje/ }).click();
  }

  async irARutaTecnica() {
    await this.menuAdministracion.click();
    await this.page.getByRole('link', { name: /Ruta técnica/ }).click();
  }

  async irAPanelAdministrador() {
    await this.menuAdministracion.click();
    await this.page.getByRole('link', { name: /Panel administrador/ }).click();
  }

  async irAWorkshops() {
    await this.menuAdministracion.click();
    await this.page.getByRole('link', { name: /Workshops/ }).click();
  }

  // Submenús de Talento
  async irABusquedaAvanzada() {
    await this.menuTalento.click();
    await this.page.getByRole('link', { name: /Búsqueda avanzada/ }).click();
  }

  async irABuscarTalento() {
    await this.menuTalento.click();
    await this.page.getByRole('link', { name: /Buscar talento/ }).click();
  }

  async irARegistro() {
    await this.menuTalento.click();
    await this.page.getByRole('link', { name: /Registro/ }).click();
  }

  async expectNavbarVisible() {
    await expect(this.menuInicio).toBeVisible();
    await expect(this.menuAdministracion).toBeVisible();
    await expect(this.menuTalento).toBeVisible();
  }
}