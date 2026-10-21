import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    
    // 🛡️ 1. Modal de advertencia: "Tu sesión está por expirar"
    await page.addLocatorHandler(
      page.getByText('Tu sesión está por expirar', { exact: true }), 
      async () => {
        // Hacemos clic en "Seguir en la app" para extender la sesión
        await page.getByRole('button', { name: 'Seguir en la app' }).click();
        console.log('⚠️ Se cerró el modal de "sesión por expirar".');
      }
    );

    // 🛡️ 2. Modal de sesión expirada: "Tu sesión ha expirado"
    await page.addLocatorHandler(
      page.getByText('Tu sesión ha expirado', { exact: true }), 
      async () => {
        // Hacemos clic en "Aceptar"
        await page.getByRole('button', { name: 'Aceptar' }).click();
        console.log('❌ Se cerró el modal de "sesión expirada".');
      }
    );

    // Continúa con el test normalmente con los "guardias" activos
    await use(page);
  },
});

export { expect };