import { useDtTestCenter } from './common/hooks/useDtTestCenter'

// 爬取数据、缓存数据
export default defineContentScript({
	matches: ['*://*/*'],
	async main() {
		// 通过background脚本获取cookies
		try {
			const cookieResponse = await browser.runtime.sendMessage({
				type: 'getAuthCookies',
				url: window.location.origin,
			})

			if (cookieResponse.success) {
				console.log('🚀 ~ voyage', cookieResponse.data.data)

				// 全局缓存cookies
				await storage.setItem('local:authCookies', cookieResponse.data.data)

				if (window.location.origin.includes('dttestcenter.zte.com.cn')) {
					const { pageData, cacheDTTestCenterData } = await useDtTestCenter()
					pageData.xAuthValue = cookieResponse.data.data.xAuthValue
					pageData.employeeId = cookieResponse.data.data.employeeId

					cacheDTTestCenterData(pageData)
				}
			}
		} catch (error) {
			console.error('获取cookies失败:', error)
		}
	},
})
