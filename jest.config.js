module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-.*)/)',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/packages/.*/example/',
    '<rootDir>/example/',
  ],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};
