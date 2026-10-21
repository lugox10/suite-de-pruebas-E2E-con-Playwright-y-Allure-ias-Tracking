import { Page, Locator, expect } from '@playwright/test';


export interface DatosTalento {
  nombre: string;
  correo: string;
  cargo: string;         // ej: 'Analista de Calidad'
  cliente: string;       // ej: 'Bancolombia'
  tutor: string;         // ej: 'Carlos Lugo'
  notas: string;
  tecnologias: string[]; // ej: ['selenum', 'Java', 'Python', 'Ruby']
}

export class RegistroTalentoPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly inputNombre: Locator;
  readonly inputCorreo: Locator;
  readonly comboJobTitle: Locator;
  readonly comboAsignation: Locator;
  readonly comboTutor: Locator;
  readonly inputNotas: Locator;
  readonly botonAbrirTecnologias: Locator;
  readonly botonCrear: Locator;
  readonly modalExito: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Registrar' });
    this.inputNombre = page.getByRole('textbox', { name: 'Nombre' });
    this.inputCorreo = page.getByRole('textbox', { name: 'Correo electrónico' });
    this.comboJobTitle = page.getByTestId('jobTitle');
    this.comboAsignation = page.getByTestId('asignation');
    this.comboTutor = page.getByTestId('tutor');
    this.inputNotas = page.getByRole('textbox', { name: 'Notas adicionales' });
    
    // Botón que abre el panel de Tecnologías
    this.botonAbrirTecnologias = page.getByRole('button', { name: 'Open' });
    
    this.botonCrear = page.getByRole('button', { name: 'Crear Talento' });
    this.modalExito = page.getByText('Registro Exitoso');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 15_000 });
    await expect(this.page).toHaveURL(/\/register/);
  }

  /**
   * Selecciona una opción en un dropdown normal de PrimeNG (jobTitle, asignation, tutor).
   */
  private async selectFromDropdown(combo: Locator, opcion: string) {
    // 1. Abrir el combo
    await combo.getByRole('button').click();
    
    // 2. Esperar a que la opción sea visible
    const opcionLocator = this.page
      .getByRole('listbox', { name: 'Option List' })
      .getByText(new RegExp(opcion, 'i'))
      .first();
      
    await opcionLocator.waitFor({ state: 'visible', timeout: 5000 });
    
    // 3. Clic en la opción
    await opcionLocator.click();
    
    // 4. Esperar un momento a que se cierre
    await this.page.waitForTimeout(300);
  }

  async llenarFormulario(datos: DatosTalento) {
    await this.inputNombre.fill(datos.nombre);
    await this.inputCorreo.fill(datos.correo);

    await this.selectFromDropdown(this.comboJobTitle, datos.cargo);
    await this.selectFromDropdown(this.comboAsignation, datos.cliente);
    await this.selectFromDropdown(this.comboTutor, datos.tutor);

    await this.inputNotas.fill(datos.notas);

    // --- MULTISELECT DE TECNOLOGÍAS (PrimeNG) ---
    
    // 1. Abrimos el dropdown UNA SOLA VEZ
    await this.botonAbrirTecnologias.click();
    
    // 2. Esperamos a que el panel de opciones se despliegue
    await this.page.locator('.p-multiselect-panel').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // 3. Iteramos sobre las tecnologías
    for (const tec of datos.tecnologias) {
      // Buscamos la opción ignorando mayúsculas y usando .first() por si hay duplicados
      const opcionTec = this.page
        .getByRole('option', { name: new RegExp(tec, 'i') })
        .first();
        
      // Esperamos a que la opción esté visible (Playwright hace scroll si es necesario)
      await opcionTec.waitFor({ state: 'visible', timeout: 5000 });
      await opcionTec.click();
      
      // Pausa para que el checkbox se marque visualmente
      await this.page.waitForTimeout(300);
    }
    
    // 4. Cerramos el panel al final (con Escape o clic fuera)
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  async crear() {
    await this.botonCrear.click();
  }

  async expectCreacionExitosa() {
    await expect(this.modalExito).toBeVisible({ timeout: 15_000 });
  }
}