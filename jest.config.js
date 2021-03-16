module.exports = {
  preset: 'ts-jest',
  testMatch: [ "**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts", "**/tests/**/*.ts"],
  testEnvironment: 'node',
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
