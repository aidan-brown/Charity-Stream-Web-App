module.exports = {
  automock: false,
  clearMocks: false,
  coveragePathIgnorePatterns: ['node_modules'],
  resetMocks: true,
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
};
