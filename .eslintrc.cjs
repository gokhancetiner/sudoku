module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		"plugin:vue/vue3-essential",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["vue", "@typescript-eslint", "prettier"],
	rules: {
		"prettier/prettier": "error",
	},
}
