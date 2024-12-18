// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

/** @type {import('eslint').Linter.Config} */
const eslintConfig = [
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: true,
  }),
  {
    plugins: {
      "@next/next": pluginNext,
    },
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
  // ...compat.config({
  //   plugins: {
  //     "@next/next": pluginNext,
  //   },
  //   rules: {
  //     ...pluginNext.configs.recommended.rules,
  //   },
  // }),
];

export default eslintConfig;
