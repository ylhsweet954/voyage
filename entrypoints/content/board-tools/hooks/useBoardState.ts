import { ref } from 'vue'

export function useBoardState() {
	const nameList = ref<string[]>([]) // 预设姓名列表，可在外部注入
	const tempNameList = ref<string[]>([]) // 当前获取到的所有姓名
	const selectedIndices = ref<number[]>([]) // 已经选中过的下标
	const showNames = ref(true) // 控制姓名面板显示
	const currentRandomText = ref('随机一位') // 随机按钮文字
	const isLoading = ref(false) // 加载状态
	const selectedName = ref<string>('') // 当前选中姓名
	const isBoardPage = ref<boolean>(/wim\/board/.test(location.href)) // 是否在看板页面

	return {
		nameList,
		tempNameList,
		selectedIndices,
		showNames,
		currentRandomText,
		isLoading,
		selectedName,
		isBoardPage,
	}
}
