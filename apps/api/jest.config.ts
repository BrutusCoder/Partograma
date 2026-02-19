import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/node_modules/**', '!**/dist/**', '!main.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@partograma/domain$': '<rootDir>/../../libs/domain/src/index.ts',
    '^@partograma/domain/(.*)$': '<rootDir>/../../libs/domain/src/$1',
    '^@partograma/validators$': '<rootDir>/../../libs/validators/src/index.ts',
    '^@partograma/validators/(.*)$': '<rootDir>/../../libs/validators/src/$1',
  },
};

export default config;
