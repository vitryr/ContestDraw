/**
 * Test Data Fixtures for E2E Tests
 */

export const testUsers = {
  free: {
    email: 'free@test.contestdraw.com',
    password: 'Test123!@#',
    firstName: 'Jean',
    lastName: 'Dupont',
    credits: 3,
    plan: 'FREE',
  },
  pro: {
    email: 'pro@test.contestdraw.com',
    password: 'Test123!@#',
    firstName: 'Marie',
    lastName: 'Martin',
    credits: 0,
    plan: 'MONTHLY',
  },
  enterprise: {
    email: 'enterprise@test.contestdraw.com',
    password: 'Test123!@#',
    firstName: 'Pierre',
    lastName: 'Bernard',
    credits: 0,
    plan: 'ENTERPRISE',
  },
  noCredits: {
    email: 'nocredits@test.contestdraw.com',
    password: 'Test123!@#',
    firstName: 'Paul',
    lastName: 'Durand',
    credits: 0,
    plan: 'FREE',
  },
};

export const newUser = () => ({
  email: `test${Date.now()}@test.contestdraw.com`,
  password: 'Test123!@#',
  firstName: 'Test',
  lastName: 'User',
});

export const testDraws = {
  manual: {
    title: 'Tirage Test Manuel',
    description: 'Description du tirage de test',
    numberOfWinners: 1,
    participants: [
      { name: 'Alice Dupont', identifier: 'alice@test.com' },
      { name: 'Bob Martin', identifier: 'bob@test.com' },
      { name: 'Charlie Bernard', identifier: 'charlie@test.com' },
      { name: 'Diana Petit', identifier: 'diana@test.com' },
      { name: 'Eric Durand', identifier: 'eric@test.com' },
    ],
  },
  instagram: {
    title: 'Tirage Instagram Test',
    description: 'Tirage depuis un post Instagram',
    numberOfWinners: 2,
    postUrl: 'https://www.instagram.com/p/TEST123/',
  },
  multipleWinners: {
    title: 'Tirage Multi-Gagnants',
    description: 'Test avec plusieurs gagnants',
    numberOfWinners: 3,
    participants: Array.from({ length: 20 }, (_, i) => ({
      name: `Participant ${i + 1}`,
      identifier: `participant${i + 1}@test.com`,
    })),
  },
};

export const stripeTestCards = {
  valid: {
    number: '4242424242424242',
    expiry: '12/28',
    cvc: '123',
    country: 'FR',
  },
  declined: {
    number: '4000000000000002',
    expiry: '12/28',
    cvc: '123',
    country: 'FR',
  },
  requires3DS: {
    number: '4000002500003155',
    expiry: '12/28',
    cvc: '123',
    country: 'FR',
  },
  insufficientFunds: {
    number: '4000000000009995',
    expiry: '12/28',
    cvc: '123',
    country: 'FR',
  },
};

export const creditPacks = {
  single: { credits: 1, price: '2.49' },
  five: { credits: 5, price: '8.00' },
  ten: { credits: 10, price: '15.00' },
  twenty: { credits: 20, price: '28.00' },
};

export const subscriptionPlans = {
  monthly: { name: 'Monthly', price: '19.99' },
  enterprise: { name: 'Enterprise', price: '49.00' },
  pass48h: { name: '48h Pass', price: '4.99' },
};
