/* eslint-disable */
export default {
  displayName: '<%= name %>',
  preset: '<%= relativeRoot %>jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/subscription-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|lodash-es))'],
};
