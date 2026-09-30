import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import * as espree from 'espree';
export default defineConfig([
  ...nextVitals,
  // Next's Babel parser does not support ESLint 10's scope manager yet.
  { files: ['**/*.js'], languageOptions: { parser: espree, parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } } },
  globalIgnores(['.next/**']),
]);
