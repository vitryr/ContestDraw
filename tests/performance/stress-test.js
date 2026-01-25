import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp up
    { duration: '3m', target: 500 }, // High load
    { duration: '1m', target: 1000 }, // Spike
    { duration: '2m', target: 100 }, // Recovery
    { duration: '1m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% under 2s during stress
    http_req_failed: ['rate<0.05'], // Less than 5% failure acceptable
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export function setup() {
  const registerRes = http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify({
      email: `stress${Date.now()}@example.com`,
      username: `stress${Date.now()}`,
      password: 'StressTest123!',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  return { token: registerRes.json('token') };
}

export default function (data) {
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  };

  // Simulate draw execution with many participants
  const drawPayload = JSON.stringify({
    title: `Stress Test Draw ${__VU}-${__ITER}`,
    instagramPostUrl: `https://www.instagram.com/p/STRESS${__VU}/`,
    winnerCount: 10,
    filters: {
      requireLike: true,
      requireComment: true,
      requireFollow: true,
    },
  });

  const res = http.post(`${BASE_URL}/api/draws`, drawPayload, {
    headers: authHeaders,
    timeout: '30s', // Increased timeout for stress conditions
  });

  check(res, {
    'status acceptable': (r) => r.status === 201 || r.status === 429, // Allow rate limiting
    'response time acceptable': (r) => r.timings.duration < 3000,
  });

  sleep(Math.random() * 3 + 1); // Random sleep 1-4s
}
