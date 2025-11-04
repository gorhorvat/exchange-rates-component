export const preset = 'ts-jest';
export const testEnvironment = 'jsdom';
export const roots = ['<rootDir>/src'];
export const setupFilesAfterEnv = ['<rootDir>/src/setupTests.ts'];
export const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$';
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const moduleNameMapper = {
  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
};
export const globals = {
  'ts-jest': {
    tsconfig: {
      jsx: 'react-jsx',
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    },
  },
};
