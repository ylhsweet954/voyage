/**
 * 向后台脚本发送消息并等待响应
 * @param message - 要发送的消息
 * @returns 后台脚本返回的响应
 */
export async function sendMessageToBackground(
	message: unknown
): Promise<unknown> {
	// 打印日志，显示正在发送的消息
	console.log('Sending message to background:', message)
	// 调用浏览器运行时的 sendMessage 方法发送消息，并等待响应
	const response = await browser.runtime.sendMessage(message)
	// 打印日志，显示接收到的响应
	console.log('Received response from background:', response)
	return response
}

// 请求大模型
export async function requestModel(prompt: string): Promise<unknown> {
	const settings =
		await storage.getItem<Record<string, string>>('local:AIConfig')
	const response = await browser.runtime.sendMessage({
		type: 'requestModel',
		config: { ...settings, prompt },
	})
	return response
}
