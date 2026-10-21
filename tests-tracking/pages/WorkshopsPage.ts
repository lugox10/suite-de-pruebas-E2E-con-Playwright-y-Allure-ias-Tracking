import { Page, Locator, expect } from '@playwright/test';

export interface DatosWorkshop {
  titulo: string;
  descripcion: string;
  dia: string;
  hora: string;
  duracion: string;
  tecnologia: string;
  speaker: string;
}

export class WorkshopsPage {
  readonly page: Page;
  readonly heading: Locator;
  
  // Filtros
  readonly btnDesde: Locator;
  readonly btnHasta: Locator;
  readonly comboTecnologia: Locator;
  readonly comboSpeaker: Locator;
  
  // Acciones principales
  readonly btnBuscar: Locator;
  readonly btnLimpiar: Locator;
  readonly btnAdd: Locator;
  
  // Resultados
  readonly tagInteresGeneral: Locator;
  readonly tagAngular: Locator;
  readonly tagArquitectura: Locator;
  readonly tagCypress: Locator;
  readonly tagMasOpciones: Locator;

  // Formulario (Crear / Editar)
  readonly inputTitle: Locator;
  readonly inputDescription: Locator;
  readonly btnDate: Locator;
  readonly btnStartTime: Locator;
  readonly btnDuration: Locator;
  readonly checkInteresGeneral: Locator;
  readonly comboTechnologies: Locator;
  readonly comboSpeakerForm: Locator;
  readonly btnCrear: Locator;
  readonly btnEditar: Locator;
  readonly btnEditCard: Locator;
  readonly modalExitoCreacion: Locator;
  readonly modalExitoEdicion: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Workshops' });
    
    // Filtros
    this.btnDesde = page.getByRole('button', { name: 'Choose Date' }).first();
    this.btnHasta = page.getByRole('button', { name: 'Choose Date' }).nth(1);
    this.comboTecnologia = page.getByTestId('multiselect-technologies');
    this.comboSpeaker = page.getByRole('button', { name: 'Speaker' });
    
    // Acciones
    this.btnBuscar = page.getByRole('button', { name: 'Buscar' });
    this.btnLimpiar = page.getByRole('button', { name: 'Limpiar' });
    this.btnAdd = page.getByRole('button', { name: 'Add' });
    
    // Resultados
    this.tagInteresGeneral = page.getByText('Interés general').first();
    this.tagAngular = page.getByText('Angular').first();
    this.tagArquitectura = page.getByText('Arquitectura').first();
    this.tagCypress = page.getByText('Cypress').first();
    this.tagMasOpciones = page.getByText(/^\+\d+$/).first(); 

    // Formulario
    this.inputTitle = page.getByTestId('title');
    this.inputDescription = page.getByTestId('description');
    this.btnDate = page.getByTestId('date').getByRole('button', { name: 'Choose Date' });
    this.btnStartTime = page.getByTestId('startTime').getByRole('button', { name: 'Seleccione' });
    this.btnDuration = page.getByTestId('duration').getByRole('button', { name: 'Seleccione' });
    this.checkInteresGeneral = page.getByRole('checkbox', { name: 'Workshop de interés general' });
    
    // 👇 AQUÍ ESTÁ EL CAMBIO 1: Hacemos clic en la flechita (trigger) en vez del input
    this.comboTechnologies = page.locator('#technologies').locator('.p-multiselect-trigger');
    
    this.comboSpeakerForm = page.getByRole('button', { name: 'Choose', exact: true }).first();
    this.btnCrear = page.getByRole('button', { name: 'Crear workshop' });
    this.btnEditar = page.getByRole('button', { name: 'Editar workshop' });
    this.btnEditCard = page.getByTestId('edit-button').first();
    this.modalExitoCreacion = page.getByText('Registro Exitoso');
    this.modalExitoEdicion = page.getByText('Actualización Exitosa');
  }

  async goto() {
    await this.page.goto('/workshops');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 15_000 });
    await expect(this.page).toHaveURL(/\/workshops/);
  }

  // --- MÉTODOS DE FILTROS ---
  async abrirCalendarios() {
    await this.btnDesde.click();
    await this.page.keyboard.press('Escape');
    await this.btnHasta.click();
    await this.page.keyboard.press('Escape');
  }

  async filtrarPorTecnologia(tecnologia: string) {
    await this.comboTecnologia.getByRole('img').click();
    const opcion = this.page.getByRole('option', { name: tecnologia, exact: true });
    await opcion.waitFor({ state: 'visible' });
    await opcion.getByRole('checkbox').check();
    await this.page.keyboard.press('Escape');
  }

  async filtrarPorSpeaker(speaker: string) {
    await this.comboSpeaker.click();
    await this.page.getByRole('option', { name: speaker }).click();
  }

  async buscar() {
    await this.btnBuscar.click();
    await this.page.waitForTimeout(1500);
  }

  async limpiarFiltros() {
    await this.btnLimpiar.click();
    await this.page.waitForTimeout(1000);
  }

  async expectTagsVisibles() {
    await expect(this.tagAngular).toBeVisible({ timeout: 10_000 });
    await expect(this.tagArquitectura).toBeVisible();
    await expect(this.tagCypress).toBeVisible();
    await expect(this.tagMasOpciones).toBeVisible();
  }

  // --- MÉTODOS DE CREACIÓN Y EDICIÓN ---
  async abrirFormularioCrear() {
    await this.btnAdd.click();
  }

   async llenarFormularioWorkshop(datos: DatosWorkshop) {
    await this.inputTitle.fill(datos.titulo);
    await this.inputDescription.fill(datos.descripcion);
    
    // --- SELECCIÓN DE FECHA ---
    await this.btnDate.click();
    await this.page
      .locator('span[data-pc-section="daylabel"]:not(.p-disabled)')
      .filter({ hasText: new RegExp(`^${datos.dia}$`) })
      .first()
      .click();
    
    // --- SELECCIÓN DE HORA ---
    await this.btnStartTime.click();
    await this.page.getByRole('option', { name: datos.hora, exact: true }).last().click();
    
    // --- SELECCIÓN DE DURACIÓN ---
    await this.btnDuration.click();
    await this.page.getByRole('option', { name: datos.duracion, exact: true }).last().click();
    
    // --- CHECKBOX ---
    await this.checkInteresGeneral.check();
    
    // --- TECNOLOGÍAS ---
    await this.comboTechnologies.click();
    await this.page.getByRole('option', { name: datos.tecnologia, exact: true }).locator('input[type="checkbox"]').check();
    
    // --- SPEAKER ---
    // (Quitamos el Escape y el waitFor. Le damos medio segundo a Angular para que respire)
    await this.page.waitForTimeout(500); 
    
    await this.comboSpeakerForm.click();
    await this.page.getByRole('option', { name: datos.speaker }).click();
  }

  async guardarCreacion() {
    await this.btnCrear.click();
  }

  async expectCreacionExitosa() {
    await expect(this.modalExitoCreacion).toBeVisible({ timeout: 15_000 });
  }

  async abrirFormularioEditar() {
    await this.btnEditCard.click();
  }

    async editarHorarioWorkshop(nuevaHora: string, nuevaDuracion: string) {
    await this.btnStartTime.click();
    
    // Buscamos SOLO las opciones que NO estén deshabilitadas (sin la clase p-disabled)
    const horasDisponibles = this.page.locator('li.p-dropdown-item:not(.p-disabled)');
    
    // Si la hora que queremos está disponible, la usa. Si no, agarra la primera que haya.
    const targetHora = horasDisponibles.filter({ hasText: nuevaHora }).first();
    if (await targetHora.isVisible()) {
      await targetHora.click({ force: true });
    } else {
      await horasDisponibles.first().click({ force: true });
    }
    
    await this.btnDuration.click();
    const duracionesDisponibles = this.page.locator('li.p-dropdown-item:not(.p-disabled)');
    const targetDuracion = duracionesDisponibles.filter({ hasText: nuevaDuracion }).first();
    if (await targetDuracion.isVisible()) {
      await targetDuracion.click({ force: true });
    } else {
      await duracionesDisponibles.first().click({ force: true });
    }
  }


  async guardarEdicion() {
    await this.btnEditar.click();
  }

  async expectEdicionExitosa() {
    await expect(this.modalExitoEdicion).toBeVisible({ timeout: 15_000 });
  }
}