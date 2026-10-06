import astro from 'eslint-plugin-astro';

/**
@type {import('xo').FlatXoConfig}
*/
const config = [
  {ignores: ['dist/**', '.astro/**', '.anima/**', 'node_modules/**']},
  {
    // Prettier owns formatting; disable conflicting XO style rules.
    prettier: 'compat',
    rules: {'import-x/extensions': 'off'},
  },
  {
    files: ['**/*.astro'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {case: 'pascalCase', checkDirectories: false, ignore: ['index.astro']},
      ],
      'n/file-extension-in-import': 'off',
    },
  },
  {
    files: ['src/pages/**/*.astro'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {case: 'kebabCase', checkDirectories: false},
      ],
    },
  },
  ...astro.configs.recommended,
  {
    files: ['src/env.d.ts'],
    // Import Astro's ambient declarations without creating a runtime import.
    rules: {'import-x/no-unassigned-import': 'off'},
  },
  {
    files: ['package.json'],
    // Toolchain versions are deliberately pinned; pnpm records exact resolutions.
    rules: {'package-json/dependency-version-range': 'off'},
  },
  {
    files: ['tests/**/*.test.mjs'],
    // Build-output assertions intentionally iterate over the typed content records.
    rules: {'node-test/no-conditional-assertion': 'off'},
  },
];

export default config;
