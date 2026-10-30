import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '10s', target: 2 },  // Ramp-up: 2 usuarios en 10 seg
    { duration: '20s', target: 5 },  // Carga: 5 usuarios por 20 seg
    { duration: '10s', target: 0 },  // Ramp-down: bajar a 0 usuarios
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'], // SLA de 800ms
    http_req_failed: ['rate<0.01'],   // Máximo 1% de errores
  },
};

const TOKEN = __ENV.AUTH_TOKEN;
const BASE_API = 'https://api.releases-iastracking.link';
const endpoints = [
  `/follow-ups/near-follow-ups/carlos.lugo@ias.com.co`,
  `/v2/paths`,
  `/workshops/speakers`,
  `/languages`,
  `/workshops/search?startDate=&endDate=&speakerEmail=&page=1&size=20`
];

export default function () {
  const params = {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Origin': 'https://releases-iastracking.link'
    },
  };

  const endpoint = randomItem(endpoints);
  const url = `${BASE_API}${endpoint}`;

  const res = http.get(url, params);

  // 🚨 SI UNA PETICIÓN TARDA MÁS DE 800ms
  if (res.timings.duration > 800) {
    console.log(` CUELLO DE BOTELLA: El endpoint ${endpoint} tardó ${res.timings.duration.toFixed(0)}ms`);
  }

  check(res, {
    'Status es 200': (r) => r.status === 200,
    'Respuesta es JSON válido': (r) => {
      try { return JSON.parse(r.body) !== null; } catch (e) { return false; }
    },
  });

  sleep(Math.random() * 2 + 1);
}

//  REPORTE PERSONALIZADO 
export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration.values['p(95)'];
  const failedRate = data.metrics.http_req_failed.values.rate * 100;
  const avg = data.metrics.http_req_duration.values.avg;
  const max = data.metrics.http_req_duration.values.max;

  let report = "\n========================================================\n";
  report += " REPORTE DE RENDIMIENTO - IAS TRACKING API\n";
  report += "========================================================\n\n";
  
  report += ` Tasa de errores: ${failedRate.toFixed(2)}%\n`;
  report += ` Tiempo promedio de respuesta: ${avg.toFixed(2)} ms\n`;
  report += ` Tiempo más lento registrado: ${max.toFixed(2)} ms\n`;
  report += ` Latencia p(95) [El 95% de las peticiones]: ${p95.toFixed(2)} ms\n\n`;

  if (p95 < 800 && failedRate < 1) {
    report += " RESULTADO: APROBADO. El sistema cumple con el SLA (<800ms) y no tiene errores.\n";
  } else {
    report += " RESULTADO: REPROBADO. El sistema NO cumple con el SLA.\n";
    if (failedRate > 1) report += "   🔍 Análisis: Hay una alta tasa de errores (posible caída o token expirado).\n";
    if (p95 >= 800) report += "   🔍 Análisis: Los endpoints de búsqueda o base de datos están tardando demasiado bajo carga.\n";
  }
  report += "========================================================\n";

  return {
    'stdout': report,
  };
}