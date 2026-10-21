import { Page, Locator, expect } from '@playwright/test';


export class HomePage {
  readonly page: Page;
  readonly userName: Locator;
  readonly botonAceptarModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator('.menu-user-name');
    this.botonAceptarModal = page.getByRole('button', { name: 'Aceptar' });
  }

  async goto() {
    await this.page.goto('/home');
  }

  async expectLoaded() {
    await expect(this.userName).toBeVisible({ timeout: 15_000 });
    await expect(this.page).toHaveURL(/\/home/);
  }

  /**
   * El modal "Tienes seguimientos atrasados" solo aparece la primera vez
   * que un usuario entra al home. Lo cerramos si está visible, sin fallar
   * si no aparece.
   */
   async dismissWelcomeModalIfVisible(timeoutMs = 10_000) {
    try {
      // Esperamos hasta 10 segundos a que el botón "Aceptar" sea visible
      await this.botonAceptarModal.waitFor({ state: 'visible', timeout: timeoutMs });
      
      // Hacemos clic
      await this.botonAceptarModal.click();
      
      // IMPORTANTE: Esperamos a que el modal desaparezca de la pantalla
      await this.botonAceptarModal.waitFor({ state: 'hidden', timeout: 5_000 });
      
      console.log('✅ Modal de seguimientos cerrado correctamente.');
    } catch (error) {
      // Si pasan los 10 segundos y no apareció, asumimos que no hay modal y seguimos
      console.log('ℹ️ Modal de seguimientos no apareció o ya estaba cerrado.');
    }
  }
}