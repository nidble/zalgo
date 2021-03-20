module.exports = {
  preset: 'ts-jest',
  testMatch: [ "**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts", "**/tests/**/*.ts"],
  testEnvironment: 'node',
  transform: { // dp
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/src/server.ts'],
  verbose: true,
  coverageReporters: ['html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
