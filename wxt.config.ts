import { defineConfig } from 'wxt'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { readFileSync } from 'fs'
import { join } from 'path'

// 读取 package.json 版本号
const packageJson = JSON.parse(
	readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
)

// See https://wxt.dev/api/config.html
export default defineConfig({
	extensionApi: 'chrome',
	modules: ['@wxt-dev/module-vue'],
	manifest: {
		permissions: [
			'storage',
			'cookies',
			'webRequest',
			'scripting',
			'tabs',
			'activeTab',
		],
		host_permissions: ['<all_urls>'],
		incognito: 'split',
		web_accessible_resources: [
			{
				resources: ['xhr-hook.js'],
				matches: ['*://*/*'],
			},
		],
	},
	vite() {
		return {
			plugins: [
				Components({
					resolvers: [NaiveUiResolver()],
				}),
			],
			resolve: {
				alias: {
					'@': '/src',
				},
			},
			define: {
				__APP_VERSION__: JSON.stringify(packageJson.version),
			},
		}
	},
})
