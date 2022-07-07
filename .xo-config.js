module.exports = {
  prettier: true,
  space: true,
  overrides: [
    {
      files: "**/*.tsx",
      // envs: ['es2021', 'browser'],
      // extends: "xo-react",
      rules: {
        // "react/react-in-jsx-scope": "off",
        "unicorn/filename-case": [
          "error",
          {
            case: "pascalCase",
          },
        ],
        "n/file-extension-in-import": "off",
        "import/extensions": "off",
      },
    },
  ],
};
