export async function clearCookie() {
	try {
		const response = await browser.runtime.sendMessage({
			type: 'clearCookie',
		})
		if (response.success) {
			message.success('清空cookie成功')
			location.reload()
		} else {
			message.error(response.error || '清空cookie失败')
		}
	} catch (err) {
		message.error(
			err instanceof Error ? err.message : String(err) || '清空cookie时发生错误'
		)
	}
}

export async function switchLangCookie() {
	try {
		const response = await browser.runtime.sendMessage({
			type: 'switchLangCookie',
			url: window.location.href,
		})
		if (response.success) {
			message.success('切换语言成功')
			location.reload()
		} else {
			message.error(response.error || '切换语言失败')
		}
	} catch (err) {
		message.error(
			err instanceof Error ? err.message : String(err) || '切换语言时发生错误'
		)
	}
}

export function login(empInfo: string, password: string = '1') {
	const empNo = empInfo.match(/\d+/)?.[0] || empInfo
	const empNoInput = document.getElementById(
		'input-loginname'
	) as HTMLInputElement | null
	if (!empNoInput) return

	const passwordInput = document.getElementById(
		'input-password'
	) as HTMLInputElement | null
	const login_btn = document.getElementsByClassName(
		'el-button login-btn el-button--primary'
	)[0] as HTMLElement | undefined

	const event = new InputEvent('input', {
		bubbles: true,
		cancelable: true,
	})

	if (empNoInput && passwordInput && login_btn) {
		empNoInput.value = empNo
		empNoInput.dispatchEvent(event)
		passwordInput.value = password
		passwordInput.dispatchEvent(event)
		login_btn.click()
	}
}

interface HashObject {
	app: string | null
	bizObject: string | null
	page: string | null
}

interface JumpButton {
	label: string
	type: 'other'
	isEnable: boolean
	handler: () => void
}

export function generateJumpBtn(): JumpButton[] {
	const url = new URL(window.location.href)
	// 主机名、端口号、路径、查询参数、hash
	const { hostname, port, pathname, searchParams, hash } = url

	// 解析 hash 内容，url中#之后的内容
	const hashParts = hash.slice(2).split('/')
	const getHashValue = (key: string): string | null => {
		const index = hashParts.indexOf(key)
		return index !== -1 && index + 1 < hashParts.length
			? hashParts[index + 1]
			: null
	}

	// 获取url中的app、bizObject、page
	const hashObject: HashObject = {
		app: getHashValue('app'),
		bizObject: getHashValue('bizObject'),
		page: getHashValue('page'),
	}

	const host = port ? `${hostname}:${port}` : hostname
	// 微服务信息 如：zte-paas-lcap-frontendcli
	const microServiceInfo = pathname.slice(1).split('/')[0]
	// 设计态的微服务路径
	const designPath = microServiceInfo.replace(
		'frontendrenderdemo',
		'frontendcli'
	)

	const layoutUrl = `https://${host}/${designPath}/layout-designer.html?lang=zh`
	const entityUrl = `https://${host}/${designPath}/entity-designer.html?lang=zh`
	const mainPageUrl = `https://${host}/${designPath}/index.html#/platform/applicationdevelopment`

	const openNewTab = (url: string): void => {
		const a = document.createElement('a')
		a.href = url
		a.target = '_blank'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	const isLayoutRunningPage =
		!!searchParams.get('bizObject') && searchParams.get('bizObject') !== 'null'
	const isCustomPageRunningPage = searchParams.get('bizObject') === 'null'
	const isNeedToLocalDebug =
		hostname !== 'local.zte.com.cn' &&
		['frontendcli', 'frontendrenderdemo', 'promgr', 'promc'].some((p) =>
			pathname.includes(p)
		)

	const getLocalPort = (): string => {
		if (pathname.includes('frontendcli')) return ':8080'
		if (pathname.includes('frontendrenderdemo')) return ':8081'
		if (pathname.includes('promgr')) return ':8086'
		if (pathname.includes('promc')) return ':8082'
		return ''
	}

	return [
		{
			label: 'to->当前布局',
			type: 'other',
			isEnable: isLayoutRunningPage,
			handler: () =>
				openNewTab(
					`${layoutUrl}${hash}/bizObject/${searchParams.get('bizObject')}`
				),
		},
		{
			label: 'to->当前实体',
			type: 'other',
			isEnable: isLayoutRunningPage,
			handler: () =>
				openNewTab(
					`${entityUrl}#/app/${hashObject.app}/bizObject/${searchParams.get(
						'bizObject'
					)}`
				),
		},
		{
			label: 'to->当前页面设计',
			type: 'other',
			isEnable: isCustomPageRunningPage,
			handler: () =>
				openNewTab(
					`${layoutUrl}#/app/${hashObject.app}/page/${hashObject.page}`
				),
		},
		{
			label: 'to->应用主页',
			type: 'other',
			isEnable: !!hashObject.app,
			handler: () => openNewTab(`${mainPageUrl}/${hashObject.app}`),
		},
		{
			label: '切换到本地调试',
			type: 'other',
			isEnable: isNeedToLocalDebug,
			handler: () => {
				const localUrl = new URL(window.location.href)
				localUrl.hostname = 'local.zte.com.cn'
				localUrl.port = getLocalPort().slice(1) // remove colon
				openNewTab(localUrl.toString())
			},
		},
	]
}

export async function testZteAI(loading: Ref<boolean>) {
	try {
		loading.value = true
		const response = await browser.runtime.sendMessage({
			type: 'requestZteAI',
			url: window.location.href,
			text: '说出你的梦想！',
		})
		console.log('🚀 ~ testZteAI ~ response:', response)
		if (response.success) {
			message.success('请求成功')
		} else {
			message.error(response.error || '请求失败')
		}
	} catch (err) {
		message.error(
			err instanceof Error ? err.message : String(err) || '请求时发生错误'
		)
	} finally {
		loading.value = false
	}
}
