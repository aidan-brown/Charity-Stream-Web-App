module.exports = {
  // All imported modules in your tests should be mocked automatically
  automock: false,

  // Automatically clear mock calls, instances and results before every test
  clearMocks: false,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // Automatically reset mock state before every test
  resetMocks: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
};
