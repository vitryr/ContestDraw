import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '2m', target: 100 }, // Stay at 100 users
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% failure
    failed_requests: ['rate<0.05'], // Custom metric
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// Test data
const TEST_USER = {
  email: `loadtest${Date.now()}@example.com`,
  username: `loadtest${Date.now()}`,
  password: 'LoadTest123!',
};

export function setup() {
  // Register test user
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(TEST_USER), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'user registered': (r) => r.status === 201,
  });

  return { token: registerRes.json('token') };
}

export default function (data) {
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  };

  // Test 1: Create Draw
  const drawPayload = JSON.stringify({
    title: `Load Test Draw ${Date.now()}`,
    description: 'Performance testing draw',
    instagramPostUrl: 'https://www.instagram.com/p/LOAD123/',
    winnerCount: 3,
    filters: {
      requireLike: true,
      requireComment: false,
    },
  });

  const createDrawRes = http.post(`${BASE_URL}/api/draws`, drawPayload, {
    headers: authHeaders,
  });

  const createSuccess = check(createDrawRes, {
    'draw created': (r) => r.status === 201,
    'draw has id': (r) => r.json('id') !== undefined,
  });

  failureRate.add(!createSuccess);

  if (createDrawRes.status === 201) {
    const drawId = createDrawRes.json('id');

    // Test 2: Get Draw Details
    const getDrawRes = http.get(`${BASE_URL}/api/draws/${drawId}`, {
      headers: authHeaders,
    });

    check(getDrawRes, {
      'get draw success': (r) => r.status === 200,
      'draw data correct': (r) => r.json('id') === drawId,
    });

    // Test 3: List Draws
    const listDrawsRes = http.get(`${BASE_URL}/api/draws`, {
      headers: authHeaders,
    });

    check(listDrawsRes, {
      'list draws success': (r) => r.status === 200,
      'draws is array': (r) => Array.isArray(r.json()),
    });
  }

  // Test 4: Get Credit Balance
  const balanceRes = http.get(`${BASE_URL}/api/credits/balance`, {
    headers: authHeaders,
  });

  check(balanceRes, {
    'get balance success': (r) => r.status === 200,
    'balance is number': (r) => typeof r.json('balance') === 'number',
  });

  sleep(1);
}

export function teardown(data) {
  console.log('Load test completed');
}
