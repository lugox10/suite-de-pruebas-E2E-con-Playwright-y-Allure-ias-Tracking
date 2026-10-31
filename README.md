🚀 Suite de Calidad Integral - IAS Tracking
Este repositorio contiene la suite de pruebas automatizadas para la plataforma IAS Tracking. Incluye pruebas E2E (Playwright), Pruebas de Rendimiento (K6), Observabilidad (Grafana + InfluxDB) y documentación para Pruebas de Seguridad (OWASP ZAP).

⚠️ 1. CONFIGURACIÓN INICIAL (¡Leer primero!)
Antes de ejecutar cualquier prueba, configura tus credenciales.

En la raíz del proyecto, abre el archivo .env:

env
BASE_URL=https://releases-iastracking.link/
USER_EMAIL=tu.correo@ias.com.co
USER_PASSWORD=tu_contraseña_segura
⚠️ IMPORTANTE SOBRE EL OTP: La aplicación usa doble factor (OTP vía AWS Cognito). Cuando ejecutes el setup, la terminal se pausará y el navegador esperará a que ingreses el código manualmente. El sistema guardará la sesión en auth.json para no volver a pedirlo en cada módulo.

📦 2. Instalación del Entorno
Abre una terminal en la raíz del proyecto:

powershell
# 1. Instalar dependencias de Node
pnpm install

# 2. Instalar navegadores de Playwright
pnpm exec playwright install
🚀 3. Pruebas E2E (Playwright)
A. Ejecución Completa (Pide OTP la primera vez)
Corre el login y todos los módulos (Home, Talento, Workshops).

powershell
pnpm exec playwright test --headed
B. Solo Módulos (Si el token sigue vivo)
Si acabas de loguearte, puedes saltar el OTP usando el auth.json guardado:

powershell
pnpm exec playwright test --project=modules --no-deps --headed
C. Renovar Token
Si el servidor cierra la sesión, vuelve a pedir el OTP para renovar auth.json:

powershell
pnpm exec playwright test --project=setup --headed
📈 4. Pruebas de Rendimiento (K6) y Observabilidad
Para probar la API autenticada, necesitamos extraer el token de AWS Cognito y usar K6.

A. Extraer el Token (idToken)

powershell
$TOKEN = node extract-token.js
B. Prueba de Carga Normal (5 usuarios)

powershell
k6 run -e AUTH_TOKEN=$TOKEN performance/authenticated-load-test.js
C. Prueba de Estrés (Hasta 40 usuarios - Encuentra el punto de quiebre)

powershell
k6 run -e AUTH_TOKEN=$TOKEN performance/stress-test.js
D. Levantar Grafana e InfluxDB (Docker) para ver Gráficas
Si quieres visualizar las métricas en tiempo real:

powershell
# 1. Levantar los contenedores de monitoreo
docker-compose up -d

# 2. Correr K6 enviando datos a InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 -e AUTH_TOKEN=$TOKEN performance/stress-test.js
Abre Grafana en: http://localhost:3000 (admin/admin).

Para apagar el laboratorio de gráficas: docker-compose down.

🛡️ 5. Pruebas de Seguridad (OWASP ZAP)
(Nota: El escaneo DAST se realizó en un laboratorio con OWASP Juice Shop, pero aquí están los comandos para atacar un entorno seguro).

A. Escaneo Baseline (Pasivo)

powershell
docker run --rm -v "${PWD}:/zap/wrk/:rw" -t zaproxy/zap-stable zap-baseline.py -t https://releases-iastracking.link/ -r zap-baseline.html
(El reporte zap-baseline.html se generará en la raíz del proyecto).

📊 6. Generación de Reportes (Allure)
Playwright genera capturas, videos y trazas en cada paso.

A. Generar el reporte HTML

powershell
pnpm exec allure generate allure-results --clean -o allure-report
B. Abrir el reporte en el navegador

powershell
pnpm exec allure open allure-report


🧪 7. Cobertura de Pruebas Actual
E2E (Playwright): Login, Navbar, Gestión de Talentos (Creación) y Administración de Workshops (Filtros, Creación y Edición).

Performance (K6): Prueba de carga y estrés sobre los endpoints de la API (/follow-ups, /workshops/search, /v2/paths). Identificación del cuello de botella a los 40 VUs.

Seguridad (ZAP): Análisis pasivo de vulnerabilidades (Headers, CORS, CSP).

🛠️ 8. Arquitectura del Proyecto
tests-tracking/pages/: Page Objects (locators y acciones).

tests-tracking/specs/: Archivos de pruebas E2E estructurados por módulos.

performance/: Scripts de K6 (authenticated-load-test.js, stress-test.js).

tests-tracking/fixtures.ts: Extensión para interceptar y cerrar automáticamente modales de "Sesión por expirar".

auth.setup.ts: Script de autenticación inicial y guardado de sesión (auth.json).

extract-token.js: Script para extraer el JWT de Cognito y usarlo en K6.

docker-compose.yml: Infraestructura local para Grafana e InfluxDB.

🛡️ Integración de Seguridad (DAST)
Se integró OWASP ZAP al repositorio para análisis dinámico de seguridad.

Automatización: Se creó el script pnpm run test:security que levanta el contenedor de ZAP y escanea el frontend de la aplicación.

Artefacto: El escaneo genera el archivo zap-baseline.html con 55 pruebas superadas y 13 advertencias medias (faltantes de cabeceras CSP, HSTS y Anti-Clickjacking).

Evidencia: 


🛡️ Reporte de Seguridad (OWASP ZAP)
Se ejecutó un escaneo DAST pasivo sobre el frontend (https://releases-iastracking.link/).

Resultado: 0 vulnerabilidades críticas (FAIL: 0), 55 reglas superadas (PASS: 55) y 13 advertencias de severidad media/baja.

Hallazgos principales (WARN): Faltan cabeceras de seguridad HTTP críticas como Content-Security-Policy (CSP), X-Frame-Options (Anti-Clickjacking) y Strict-Transport-Security (HSTS).

Recomendación: Configurar dichas cabeceras en el servidor (Nginx/API Gateway) para proteger a los usuarios contra ataques de secuestro de clic y sniffing de tráfico.

Evidencia: El reporte completo se encuentra en el archivo zap-baseline.html generado en la raíz del proyecto. y se ve desde la pantalla superior derecha del navegador