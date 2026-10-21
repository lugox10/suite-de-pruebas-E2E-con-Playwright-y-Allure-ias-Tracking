import { Page, Locator, expect } from '@playwright/test';

export class OtpPage {
  readonly page: Page;
  readonly codeInput: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.codeInput = page.getByRole('textbox', { name: 'Código *' });
    this.confirmButton = page.getByRole('button', { name: 'Confirmar' });
  }

  async expectLoaded() {
    await expect(
      this.page.getByRole('heading', { name: 'Código de verificación enviado' })
    ).toBeVisible({ timeout: 30_000 });
  }

  async waitForManualLogin() {
    console.log('\n✋ ============================================');
    console.log('✋  Escribe el OTP en el navegador.');
    console.log('✋  Pulsa "Confirmar" TÚ MISMO en el navegador.');
    console.log('✋  Playwright esperará hasta 4 minutos.');
    console.log('✋ ============================================\n');

    // Señal de login exitoso: aparece el nombre del usuario en el menú
    await expect(
      this.page.locator('.menu-user-name')
    ).toBeVisible({ timeout: 240_000 });
  }
}