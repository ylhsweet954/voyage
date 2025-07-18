import { featureConfig, aiConfig } from '@/entrypoints/common/config'
import {
	testAPI,
	clearCookie,
	requestModelService,
	switchLangCookie,
	cacheDTTestCenterData,
	getDTTestCenterData,
	getAuthCookies,
	initializeConfig,
} from '@/entrypoints/background/utils'
import { requestZteAI } from '../common/requestZteAI'
import { requestOpenAI } from './openai'

export default defineBackground(() => {
	// 处理来自 popup 和 content script 的消息
	browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
		;(async () => {
			try {
				let response
				switch (request.type) {
					case 'testAPI':
						response = await testAPI(request.config)
						break
					case 'requestOpenAI':
						response = await requestOpenAI(request.config, request.prompt)
						break
					case 'clearCookie':
						response = clearCookie()
						break
					case 'switchLangCookie':
						response = switchLangCookie(request.url)
						break
					case 'requestModel':
						response = await requestModelService(request.config)
						break
					case 'requestZteAI':
						response = await requestZteAI({
							text: request.text,
							url: request.url,
						})
						break
					case 'cacheDTTestCenterData':
						response = await cacheDTTestCenterData(
							request.data,
							request.url,
							request.timestamp
						)
						break
					case 'getDTTestCenterData':
						response = await getDTTestCenterData()
						break
					case 'getAuthCookies':
						response = await getAuthCookies(request.url)
						break
					default: {
						throw new Error(`Unknown request type: ${request.type}`)
					}
				}
				sendResponse({ success: true, data: response })
			} catch (error: unknown) {
				console.error('Request failed:', error)
				sendResponse({
					success: false,
					error: error instanceof Error ? error.message : '请求失败',
				})
			}
		})()

		return true
	})

	browser.runtime.onInstalled.addListener(async () => {
		await Promise.all([
			initializeConfig('local:AIConfig', aiConfig),
			initializeConfig('local:featureConfig', featureConfig),
		])
	})
})
