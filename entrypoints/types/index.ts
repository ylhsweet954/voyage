export default { name: 'Voyage-Tools-types' }

export interface AIConfig {
	baseUrl: string
	apiKey: string
	model: string
	prompt?: string
}

export interface Feature {
	label: string
	key: string
	enabled: boolean
	urlPattern: RegExp | string
	description?: string
	usage?: string[]
	icon?: string
	category?: string
	showUsage?: boolean
	subFeatures?: SubFeature[]
}

export interface SubFeature {
	label: string
	key: string
	enabled: boolean
	description?: string
}

export interface FeatureButton {
	label: string
	type: 'function' | 'login' | 'other'
	handler: () => void
	loading?: boolean
	isDefault?: boolean
	isEnable?: boolean
}

declare global {
	interface XMLHttpRequest {
		_url: string
	}

	// 应用版本号全局变量
	const __APP_VERSION__: string
}
