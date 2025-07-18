import { ref, Ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useJsonEditor } from './useJsonEditor'

export function useJsonComparator(
	compareAEditorRef: Ref<HTMLElement | undefined>,
	compareBEditorRef: Ref<HTMLElement | undefined>
) {
	const comparing = ref(false)
	const compareResult = ref('')
	const message = useMessage()

	const {
		compareJsonA,
		compareJsonB,
		initializeEditor,
		compareJsonData,
		clearEditor,
		setEditorContent,
	} = useJsonEditor()

	function initializeEditors() {
		// 初始化对比编辑器
		if (compareAEditorRef.value) {
			initializeEditor(compareAEditorRef.value, 'compareA')
		}
		if (compareBEditorRef.value) {
			initializeEditor(compareBEditorRef.value, 'compareB')
		}
	}

	async function compareJson() {
		comparing.value = true
		try {
			const result = await compareJsonData()
			if (result.success) {
				compareResult.value = result.result || ''
				message.success('JSON 对比完成')
			} else {
				message.error(result.error || '对比失败')
			}
		} catch {
			message.error('对比过程中发生错误')
		} finally {
			comparing.value = false
		}
	}

	async function formatCompareJsonA() {
		try {
			if (compareJsonA.value.trim()) {
				const parsed = JSON.parse(compareJsonA.value)
				const formatted = JSON.stringify(parsed, null, 2)
				setEditorContent('compareA', formatted)
				message.success('JSON A 格式化成功')
			}
		} catch {
			message.error('JSON A 格式化失败：格式不正确')
		}
	}

	async function formatCompareJsonB() {
		try {
			if (compareJsonB.value.trim()) {
				const parsed = JSON.parse(compareJsonB.value)
				const formatted = JSON.stringify(parsed, null, 2)
				setEditorContent('compareB', formatted)
				message.success('JSON B 格式化成功')
			}
		} catch {
			message.error('JSON B 格式化失败：格式不正确')
		}
	}

	function clearCompareA() {
		clearEditor('compareA')
		compareResult.value = ''
	}

	function clearCompareB() {
		clearEditor('compareB')
		compareResult.value = ''
	}

	return {
		compareJsonA,
		compareJsonB,
		comparing,
		compareResult,
		compareJson,
		formatCompareJsonA,
		formatCompareJsonB,
		clearCompareA,
		clearCompareB,
		initializeEditors,
	}
}
