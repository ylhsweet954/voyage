interface RequestParams {
	url: string
	text: string
	[key: string]: unknown
}

export async function requestZteAI(params: RequestParams) {
	try {
		let output = ''
		const xAuthValue = await browser.cookies
			.get({
				name: 'UCSSSOToken',
				url: params.url,
			})
			.then((cookie) => cookie?.value || '')
		const account = await browser.cookies
			.get({
				name: 'UCSSSOAccount',
				url: params.url,
			})
			.then((cookie) => cookie?.value || '')

		await fetchEventStream(
			'https://studio.zte.com.cn/zte-studio-ai-platform/openapi/v1/chat',
			{
				chatUuid: '',
				chatName: '',
				stream: true,
				keep: false,
				text: params.text,
				model: '',
			},
			{ xAuthValue, account },
			(msg) => {
				const delta = msg.result
				if (delta) {
					output += delta
				}
			},
			(err) => {
				output += `\n❌ 错误: ${err.message}`
				console.error('❌ 请求错误:', err)
			},
			() => {
				console.log('✅ 全部接收完成:', output)
			}
		)
		return output
	} catch (error: unknown) {
		console.error('failed:', error)
		if (error instanceof Error) {
			throw new Error(error.message)
		}
		throw new Error('操作失败')
	}
}

async function fetchEventStream(
	url: string,
	body: Record<string, unknown>,
	headers: Record<string, string>,
	onMessage?: (arg: { result: string }) => void,
	onError?: (arg: Error) => void,
	onDone?: () => void
) {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				'Content-Type': 'application/json',
				'X-Auth-Value': headers.xAuthValue,
				'X-Emp-No': headers.account,
				Authorization:
					'Bearer 8c599c25cb484372af9ed349fbed7fb6-0997f51d137d4da7a87710839f74a893',
			},
			body: JSON.stringify(body),
		})

		if (!response.ok || !response.body) {
			throw new Error(`Network response was not ok: ${response.statusText}`)
		}

		const reader = response.body.getReader()
		const decoder = new TextDecoder('utf-8')
		let buffer = ''

		while (true) {
			const { done, value } = await reader.read()
			if (done) {
				if (onDone) onDone()
				break
			}

			buffer += decoder.decode(value, { stream: true })

			const lines = buffer.split('\n')
			buffer = lines.pop() || ''

			for (let line of lines) {
				line = line.trim()
				if (line === '' || line.startsWith(':')) continue
				if (line.startsWith('data:')) {
					const data = line.slice(5).trim()
					if (data === '[DONE]') {
						if (onDone) onDone()
						return
					}
					try {
						const parsed = JSON.parse(data)
						if (onMessage) onMessage(parsed)
					} catch (err) {
						console.warn('JSON parse error:', err, 'Original data:', data)
					}
				}
			}
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			if (onError) onError(error)
		} else {
			if (onError) onError(new Error(String(error)))
		}
	}
}
