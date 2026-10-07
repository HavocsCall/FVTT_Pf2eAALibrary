import js from "@eslint/js";
import globals from "globals";

export default [
	{
		ignores: ["node_modules/**", "packs/**"],
	},
	js.configs.recommended,
	{
		files: ["**/*.{js,mjs}"],
		rules: {
			"indent": ["error", "tab", { "SwitchCase": 1 }],
			"no-unused-vars": ["error", { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
		},
	},
	{
		files: ["src/**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				Hooks: "readonly",
				foundry: "readonly",
				game: "readonly",
				ui: "readonly",
			},
		},
	},
];
