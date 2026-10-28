/** Shared ESLint base for non-Next packages (apps/api, packages/*). */
const base = [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      ".turbo/**",
      "**/coverage/**",
      "uploads/**",
      "*-data/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
    },
  },
];

module.exports = base;
