import { Feature } from '@/entrypoints/types'
import { useRenderContent } from './useRenderContent'
import { featureConfig, action } from '@/entrypoints/common/config'

// Content
export default defineContentScript({
	matches: ['*://*/*'],
	async main(ctx) {
		const { renderContentUI } = useRenderContent()

		// TODO 调试需要，待删除
		// await storage.setItem('local:featureConfig', featureConfig)

		// 获取功能配置
		let localFeatureConfig = (await storage.getItem(
			'local:featureConfig'
		)) as Feature[]

		if (!localFeatureConfig) {
			await storage.setItem('local:featureConfig', featureConfig)
			localFeatureConfig = featureConfig
		}

		const currentUrl = window.location.href

		const config = Object.values(localFeatureConfig)
		config.forEach((feature) => {
			if (feature.enabled) {
				const reg = new RegExp(feature.urlPattern)

				if (reg.test(currentUrl)) {
					renderContentUI(ctx, feature.key)
				}
			}
		})

		chrome.runtime.onMessage.addListener((message) => {
			// popup 发送消息，切换功能显示隐藏
			if (message.action === action.feature_toggle) {
				const { feature: featureKey, visible } = message
				if (visible) {
					renderContentUI(ctx, featureKey)
				} else {
					const targetElement = document.getElementById(featureKey)
					if (targetElement) {
						targetElement.remove()
					}
				}
			}
		})
	},
})
