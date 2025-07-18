import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
	// 忽略的文件和目录
	{
		ignores: [
			'**/node_modules/**',
			'**/.wxt/**',
			'**/.output/**',
			'**/dist/**',
			'**/build/**',
			'components.d.ts',
		],
	},

	// JavaScript 基础配置
	js.configs.recommended,

	// TypeScript 配置
	...tseslint.configs.recommended,

	// Vue 配置
	...vue.configs['flat/recommended'],

	// 全局配置
	{
		files: ['**/*.{js,ts,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: vue.configs['flat/recommended'][0].languageOptions.parser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: ['.vue'],
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				// 浏览器扩展环境变量
				chrome: 'readonly',
				browser: 'readonly',
				// 浏览器全局变量
				...globals.browser,
				// Node.js 环境变量
				process: 'readonly',
				console: 'readonly',
				// Naive UI message全局变量
				message: 'readonly',
				// 应用版本号全局变量
				__APP_VERSION__: 'readonly',
			},
		},
		rules: {
			// Vue 相关规则
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'off',
			'vue/require-default-prop': 'off',
			'vue/require-explicit-emits': 'off',
			'vue/attributes-order': 'warn',
			'vue/html-self-closing': [
				'error',
				{
					html: {
						void: 'always',
						normal: 'always',
						component: 'always',
					},
					svg: 'always',
					math: 'always',
				},
			],

			// TypeScript 相关规则
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/prefer-as-const': 'error',
			'@typescript-eslint/no-unused-expressions': 'warn',

			// 通用规则
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'no-case-declarations': 'warn',
			'prefer-const': 'error',
			'no-var': 'error',
			'object-shorthand': 'error',
			'prefer-template': 'warn',
		},
	},

	// WXT 特定配置
	{
		files: ['wxt.config.ts', 'entrypoints/**/*.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},

	// Prettier 集成（必须放在最后）
	prettier,
]
