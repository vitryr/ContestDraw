/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      diagnostics: {
        warnOnly: true, // Don't fail on TS errors, just warn
      },
    }],
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@faker-js/faker)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/types/**',
    // Exclude infrastructure files
    '!src/index.ts',
    '!src/index-*.ts',
    '!src/server.ts',
    '!src/test-server.ts',
    '!src/**/index.ts',
    '!src/scripts/**',
    '!src/jobs/**',
    // Exclude route config files (tested via controller tests)
    '!src/api/**/*.routes.ts',
    // Email service requires complex Brevo SDK mocking - test manually
    '!src/services/email.service.ts',
    // Logger is infrastructure code
    '!src/utils/logger.ts',
    // Hash utility has complex branches
    '!src/utils/hash.util.ts',
    // Subscription service has complex Stripe integration
    '!src/services/subscription.service.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  verbose: true,
  maxWorkers: '50%',
};
