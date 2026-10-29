import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,             // 1 Usuario Virtual
  duration: '10s',    // Durante 10 segundos
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben tardar menos de 500ms
    http_req_failed: ['rate<0.01'],   // Menos del 1% de las peticiones pueden fallar
  },
};

export default function () {
  // Hacemos una petición GET a la página principal
  const res = http.get('https://releases-iastracking.link/');

  // Validamos que el servidor responda con un código 200 (OK)
  check(res, {
    'El estado es 200 (OK)': (r) => r.status === 200,
    'La página cargó en menos de 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1); // Esperamos 1 segundo antes de volver a hacer la petición
}