import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '20s', target: 20 },
    { duration: '20s', target: 40 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
  },
};

const TOKEN = __ENV.AUTH_TOKEN;
const BASE_API = 'https://api.releases-iastracking.link';

const endpoints = [
  `/follow-ups/near-follow-ups/carlos.lugo@ias.com.co`,
  `/workshops/search?startDate=&endDate=&speakerEmail=&page=1&size=20`,
  `/v2/paths`
];

export default function () {
  const params = {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Origin': 'https://releases-iastracking.link'
    },
  };

  const endpoint = randomItem(endpoints);
  const url = `${BASE_API}${endpoint}`;

  const res = http.get(url, params);

  if (res.timings.duration > 2000) {
    console.log(`🚨 LENTITUD EXTREMA: ${endpoint} tardó ${res.timings.duration.toFixed(0)}ms`);
  }

  check(res, {
    'Status es 200': (r) => r.status === 200,
    'Status NO es 500 (Error Interno)': (r) => r.status !== 500,
  });

  sleep(Math.random() * 1 + 0.5);
}

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration.values['p(95)'];
  const failedRate = data.metrics.http_req_failed.values.rate * 100;
  const maxDuration = data.metrics.http_req_duration.values.max;
  
  let report = "\n========================================================\n";
  report += "💥 REPORTE DE PRUEBA DE ESTRÉS - IAS TRACKING\n";
  report += "========================================================\n\n";

  report += `⏱️ Latencia p(95): ${p95.toFixed(2)} ms\n`;
  report += `🐢 Petición más lenta: ${maxDuration.toFixed(2)} ms\n`;
  report += `❌ Tasa de errores: ${failedRate.toFixed(2)}%\n\n`;

  if (p95 > 800 || failedRate > 1) {
    report += "🔴 PUNTO DE QUIEBRE ENCONTRADO:\n";
    if (p95 > 800) report += "   - La latencia superó el SLA aceptable (800ms).\n";
    if (failedRate > 1) report += "   - El servidor empezó a rechazar peticiones (posible caída o rate limit).\n";
    report += "   👉 Recomendación: Revisar escalabilidad de la base de datos o límites de AWS API Gateway.\n";
  } else {
    report += "🟢 EL SISTEMA SOPORTÓ LA CARGA. Aún no encontramos el límite.\n";
    report += "   👉 Recomendación: Aumentar los stages a 100 o 200 usuarios en la próxima corrida.\n";
  }
  report += "========================================================\n";

  return { 'stdout': report };
}