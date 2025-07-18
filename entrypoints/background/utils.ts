import { AIConfig, Feature } from '@/entrypoints/types'
import { ofetch } from 'ofetch'
import { storage } from 'wxt/storage'

export async function testAPI(config: AIConfig) {
	try {
		const response = await ofetch(`${config.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.apiKey}`,
			},
			timeout: 5000,
			body: JSON.stringify({
				model: config.model,
				messages: [
					{
						role: 'user',
						content: "Say 'API connection successful!' in Chinese",
					},
				],
			}),
		})
		return response
	} catch (error: unknown) {
		console.error('Test API failed:', error)
		throw new Error('API 连接失败')
	}
}

export async function requestModelService(config: AIConfig) {
	console.log('🚀 ~ requestModelService ~ config:', config)
	try {
		const response = await ofetch(`${config.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.apiKey}`,
			},
			timeout: 5000,
			body: JSON.stringify({
				model: config.model,
				messages: [
					{
						role: 'user',
						content: config.prompt || "Say '请提供您的提示词'",
					},
				],
			}),
		})
		return response
	} catch (error: unknown) {
		console.error('Test API failed:', error)
		throw new Error(error instanceof Error ? error.message : 'API 连接失败')
	}
}

export function clearCookie() {
	// 获取并删除所有 Cookie
	browser.cookies.getAll({}, (cookies) => {
		cookies.forEach((cookie) => {
			const url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${
				cookie.path
			}`

			browser.cookies.remove(
				{
					url,
					name: cookie.name,
				},
				(details) => {
					console.log(`已删除: ${cookie.name}`, details)
				}
			)
		})
	})

	return {
		message: '所有 Cookie 已清除',
	}
}

export function switchLangCookie(url: string) {
	browser.cookies.getAll({}, (cookies) => {
		cookies.forEach((cookie) => {
			if (cookie.name.includes('Lang')) {
				// 删除旧cookie
				browser.cookies.remove({
					url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${
						cookie.path
					}`,
					name: cookie.name,
				})
				// 设置新语言cookie
				const newValue = cookie.value === 'zh_CN' ? 'en_US' : 'zh_CN'
				browser.cookies.set({
					url,
					name: cookie.name,
					value: newValue,
					expirationDate: Math.floor(Date.now() / 1000) + 3600,
				})
			}
		})
	})

	return {
		message: '语言切换完成',
	}
}

// 缓存DTTestCenter页面数据
export async function cacheDTTestCenterData(
	data: any,
	url: string,
	timestamp: number
) {
	try {
		const cacheData = {
			data,
			url,
			timestamp,
			cachedAt: Date.now(),
		}

		// 存储到插件的本地存储中
		await storage.setItem('local:dtTestCenterData', cacheData)

		console.log('DTTestCenter数据已缓存:', cacheData)

		return {
			success: true,
			message: 'DTTestCenter数据缓存成功',
			cachedItemsCount: Object.keys(data).length,
		}
	} catch (error) {
		console.error('缓存DTTestCenter数据失败:', error)
		throw new Error(
			`缓存数据失败: ${error instanceof Error ? error.message : '未知错误'}`
		)
	}
}

// 获取缓存的DTTestCenter数据
export async function getDTTestCenterData() {
	try {
		const cachedData = await storage.getItem('local:dtTestCenterData')

		if (!cachedData) {
			return {
				success: false,
				message: '未找到缓存的DTTestCenter数据',
				data: null,
			}
		}

		return {
			success: true,
			message: 'DTTestCenter数据获取成功',
			data: cachedData,
		}
	} catch (error) {
		console.error('获取DTTestCenter数据失败:', error)
		throw new Error(
			`获取缓存数据失败: ${error instanceof Error ? error.message : '未知错误'}`
		)
	}
}

// 获取zte页面的cookies
export async function getAuthCookies(url: string) {
	try {
		// 获取指定网站的所有cookies
		const cookies = await browser.cookies.getAll({
			url,
		})

		// 查找需要的cookie值
		const cookieData = {
			xAuthValue: '',
			employeeId: '',
		}

		// 优先获取iAuthTid_prod或ZTEDPGSSOCookie
		const xAuthValueCookie =
			cookies.find((c) => c.name === 'iAuthTid_prod') ||
			cookies.find((c) => c.name === 'ZTEDPGSSOCookie')
		if (xAuthValueCookie) {
			cookieData.xAuthValue = xAuthValueCookie.value
		}

		// 优先获取iAuthUid_prod或ZTEDPGSSOUser
		const employeeIdCookie =
			cookies.find((c) => c.name === 'iAuthUid_prod') ||
			cookies.find((c) => c.name === 'ZTEDPGSSOUser')
		if (employeeIdCookie) {
			cookieData.employeeId = employeeIdCookie.value
		}

		return {
			success: true,
			data: cookieData,
		}
	} catch (error) {
		console.error('获取 cookies失败:', error)
		throw new Error(
			`获取cookies失败: ${error instanceof Error ? error.message : '未知错误'}`
		)
	}
}

// 在安装时初始化配置
export async function initializeConfig(
	key: `local:${string}`,
	defaultValue: { baseUrl: string; apiKey: string; model: string } | Feature[]
) {
	const localConfig = await storage.getItem(key)
	if (!localConfig) {
		await storage.setItem(key, defaultValue)
	}
}
