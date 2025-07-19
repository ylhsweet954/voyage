import { ref, onMounted, computed, Ref } from 'vue'
import { storage } from 'wxt/storage'
import message from '@/components/message'
import { loginAccounts } from '@/entrypoints/common/config'
import { FeatureButton } from '@/entrypoints/types'
import {
	clearCookie,
	switchLangCookie,
	login,
	generateJumpBtn,
	testZteAI,
} from '../util'

export function useContent(emit?: any, modalState?: Ref<boolean>) {
	const loading = ref(false)
	const empInput = ref('')
	const cachedEmps = ref<string[]>([])
	const empIds =
		ref<Array<{ username: string; password: string }>>(loginAccounts)

	// 初始化从缓存加载工号
	onMounted(async () => {
		let cached = await storage.getItem<string>('local:cachedEmps')
		if (typeof cached !== 'string') {
			await storage.setItem('local:cachedEmps', JSON.stringify([]))
			cached = ''
		}

		cachedEmps.value = cached ? JSON.parse(cached) : []
	})

	const functionButtons: FeatureButton[] = [
		{
			label: '清空Cookie并刷新',
			type: 'function',
			handler: clearCookie,
			isDefault: true,
		},
		{
			label: '切换Cookie语言并刷新',
			type: 'function',
			handler: switchLangCookie,
			isDefault: true,
		},
	]

	const loginButtons = computed<FeatureButton[]>(() => {
		const defaultEmps = empIds.value.map((item) => ({
			label: item.username,
			type: 'login' as const,
			handler: () => login(item.username, item.password),
			isDefault: true,
			isEnable: true,
		}))

		const cacheEmps = cachedEmps.value.map((item) => ({
			label: item,
			type: 'login' as const,
			handler: () => login(item),
			isDefault: false,
			isEnable: true,
		}))

		return [...defaultEmps, ...cacheEmps]
	})

	// 可以添加其他类型的按钮
	const otherButtons = computed<FeatureButton[]>(() => [
		{
			label: modalState?.value ? '关闭弹窗' : '打开弹窗',
			type: 'function',
			handler: () => {
				if (emit) {
					emit('modal-toggle', !modalState?.value)
				}
			},
			isDefault: true,
		},
		{
			label: '请求AI服务',
			type: 'other',
			loading: loading.value,
			isEnable: false,
			handler: () => testZteAI(loading),
		},
		...generateJumpBtn(),
	])

	const buttons = computed(() =>
		[...functionButtons, ...otherButtons.value, ...loginButtons.value].filter(
			(item) => item.isEnable !== false
		)
	)

	function handleLogin() {
		if (!empInput.value) return

		const allEmps = [
			...empIds.value.map((item) => item.username),
			...cachedEmps.value,
		]
		// 更新缓存
		if (!allEmps.includes(empInput.value)) {
			cachedEmps.value.push(empInput.value)
			storage.setItem('local:cachedEmps', JSON.stringify(cachedEmps.value))
		} else {
			message.warning('该账号已存在，无需重复添加')
		}

		login(empInput.value)
		empInput.value = ''
	}

	function removeCachedEmp(empId: string) {
		cachedEmps.value = cachedEmps.value.filter((emp) => emp !== empId)
		storage.setItem('local:cachedEmps', JSON.stringify(cachedEmps.value))
	}

	function swapEmp(empId: string) {}

	return {
		buttons,
		empIds,
		loading,
		empInput,
		handleLogin,
		cachedEmps,
		removeCachedEmp,
		swapEmp,
	}
}
