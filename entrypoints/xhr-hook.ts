export default defineUnlistedScript(() => {
	// 拦截XMLHttpRequest
	const open = XMLHttpRequest.prototype.open
	XMLHttpRequest.prototype.open = function (
		this: XMLHttpRequest & { _url: string },
		method: string,
		url: string | URL,
		async?: boolean,
		username?: string | null,
		password?: string | null
	) {
		// 记录请求地址
		this._url = typeof url === 'string' ? url : url.toString()
		return open.call(this, method, url, async ?? true, username, password)
	}

	const send = XMLHttpRequest.prototype.send
	XMLHttpRequest.prototype.send = function (
		this: XMLHttpRequest & { _url: string },
		body?: Document | XMLHttpRequestBodyInit | null
	) {
		this.addEventListener(
			'load',
			function (this: XMLHttpRequest & { _url: string }) {
				const url = this._url || ''

				// 过滤特定请求，RDC的板数据加载
				if (url.includes('/rdc/board/workspace')) {
					try {
						const data = JSON.parse(this.responseText)
						window.postMessage({ type: 'FROM_EXTENSION_API_DATA', data }, '*')
					} catch (e) {
						// 忽略非 JSON
					}
				}
			}
		)
		return send.call(this, body)
	}
})
