🚀 Automatización E2E - IAS Tracking
Suite de pruebas automatizadas End-to-End construida con Playwright + TypeScript + Allure Reports para la plataforma IAS Tracking.

⚠️ 1. CONFIGURACIÓN INICIAL  (¡Leer primero!)
Antes de ejecutar cualquier prueba, es obligatorio configurar las credenciales de acceso.

En la raíz del proyecto, abre el archivo .env.

Modifica las credenciales con tu usuario y contraseña de prueba:

env
BASE_URL=https://releases-iastracking.link/
USER_EMAIL=tu.correo@ias.com.co
USER_PASSWORD=tu_contraseña_segura
⚠️ IMPORTANTE SOBRE EL OTP:
La aplicación cuenta con autenticación de doble factor (OTP). Cuando ejecutes los tests, la terminal se pausará y el navegador se quedará abierto esperando que ingreses el código OTP que llegue a tu aplicación de autenticación. Una vez lo ingreses manualmente en el navegador y presiones "Confirmar", el test continuará automáticamente. (Solo tendrás que hacer esto una vez por ejecución, el sistema guardará la sesión en auth.json para los demás módulos).

📦 2. Instalación del Entorno
Abre una terminal en la raíz del proyecto y ejecuta:

powershell
# 1. Instalar las dependencias de Node
pnpm install

# 2. Instalar los navegadores de Playwright
pnpm exec playwright install
🚀 3. Comandos de Ejecución
A. Ejecución Completa (Recomendado para la primera vez)
Este comando ejecutará el Login (pidiendo el OTP), guardará el token y luego correrá todos los módulos de la aplicación (Home, Talento, Workshops) mostrando el navegador paso a paso.

powershell
pnpm exec playwright test --headed
B. Ejecución solo de Módulos (Sin pedir OTP)
Si acabas de correr la ejecución completa y el token sigue vivo, o si solo quieres probar los módulos funcionales sin volver a iniciar sesión:

powershell
pnpm exec playwright test --project=modules --no-deps --headed
C. Regenerar Sesión (Si el token expiró)
Si el servidor de pruebas cierra la sesión por inactividad, corre este comando para que te pida el OTP nuevamente y renueve el pase:

powershell
pnpm exec playwright test --project=setup --headed
📊 4. Generación de Reportes (Allure)
Playwright genera capturas de pantalla, videos y trazas en cada paso. Para ver el reporte visual profesional con todas las evidencias, ejecuta:

powershell
# 1. Generar el reporte HTML
pnpm exec allure generate allure-results --clean -o allure-report

# 2. Abrir el reporte en el navegador
pnpm exec allure open allure-report
(El reporte se abrirá automáticamente en http://localhost:... agrupado por Épicas y Features).

🧪 5. Cobertura de Pruebas Actual
El proyecto cuenta con una arquitectura Page Object Model (POM) y manejo automático de modales de sesión. Actualmente cubre los siguientes flujos:

Autenticación: Login con credenciales y validación de pantalla OTP.

Home / Navegación: Validación de la barra de navegación principal y redirecciones.

Gestión de Talento: Creación de talentos, llenado de formularios y multiselectores.

Administración - Workshops:

Filtros de búsqueda (Tecnología y Speaker).

Validación de etiquetas dinámicas.

Creación de nuevos workshops.

Edición de horarios y duraciones.

🛠️ 6. Arquitectura del Proyecto
tests-tracking/pages/: Contiene los Page Objects (locators y acciones de cada pantalla).

tests-tracking/specs/: Contiene los archivos de prueba estructurados por módulos.

tests-tracking/fixtures.ts: Extensión de Playwright que intercepta y cierra automáticamente los modales de "Sesión por expirar" y "Seguimientos pendientes" sin ensuciar el código de los tests.

auth.setup.ts: Script encargado de gestionar el login inicial y guardar el token (auth.json).