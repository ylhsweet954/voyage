export async function useDtTestCenter() {
	// 解析当前URL，提取taskId
	const url = window.location.href
	const match = url.match(/testResult\/(\d+)/)
	const pageData = {
		taskId: '',
		executeId: '',
		xAuthValue: '',
		employeeId: '',
	}
	if (match) {
		pageData.taskId = match[1]
	}

	// 获取构建序号input元素的值
	try {
		const executeValue = await waitForElementWithValue(
			'input[placeholder="请选择构建序号"]'
		)
		if (executeValue) {
			pageData.executeId = executeValue
		}
	} catch (error) {
		console.error('获取构建序号失败:', error)
	}

	async function cacheDTTestCenterData(data: typeof pageData) {
		await browser.runtime.sendMessage({
			type: 'cacheDTTestCenterData',
			data,
			url: window.location.href,
			timestamp: Date.now(),
		})
	}

	return { pageData, cacheDTTestCenterData }
}

// 等待元素出现并且有值
function waitForElementWithValue(
	selector: string,
	timeout = 15000
): Promise<string> {
	return new Promise((resolve) => {
		const checkElement = () => {
			const element = document.querySelector(selector) as HTMLInputElement
			if (element && element.value && element.value.trim() !== '') {
				resolve(element.value)
				return true
			}
			return false
		}

		// 立即检查一次
		if (checkElement()) return

		// 使用MutationObserver监听DOM变化和属性变化
		const observer = new MutationObserver(() => {
			if (checkElement()) {
				observer.disconnect()
			}
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['value'],
		})

		// 同时使用定时器定期检查，因为value变化可能不会触发MutationObserver
		const intervalId = setInterval(() => {
			if (checkElement()) {
				observer.disconnect()
				clearInterval(intervalId)
			}
		}, 500)

		// 超时处理
		setTimeout(() => {
			observer.disconnect()
			clearInterval(intervalId)
			resolve('')
		}, timeout)
	})
}
