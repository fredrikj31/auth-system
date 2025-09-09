import onlyWarn from "eslint-plugin-only-warn";
import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/dist",
      "**/.eslintrc",
      "**/postcss.config.js",
      "**/tailwind.config.js",
      "**/node_modules",
      "**/build",
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "prettier",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
    ),
  ),
  {
    plugins: {
      "only-warn": onlyWarn,
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        React: true,
        JSX: true,
      },

      parser: tsParser,
    },
  },
];
