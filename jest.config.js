module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/js/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/js/tests/setup.ts'],
  collectCoverage: true,
};