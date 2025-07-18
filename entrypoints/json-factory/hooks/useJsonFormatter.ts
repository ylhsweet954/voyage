import { ref, Ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useJsonEditor } from './useJsonEditor'

export function useJsonFormatter(
	inputEditorRef: Ref<HTMLElement | undefined>,
	outputEditorRef: Ref<HTMLElement | undefined>
) {
	const formatting = ref(false)
	const message = useMessage()

	const {
		inputJson,
		formattedJson,
		initializeEditor,
		formatJsonData,
		copyToClipboard,
		clearEditor,
	} = useJsonEditor()

	function initializeEditors() {
		// 初始化格式化编辑器
		if (inputEditorRef.value) {
			initializeEditor(inputEditorRef.value, 'input')
		}
		if (outputEditorRef.value) {
			initializeEditor(outputEditorRef.value, 'output', true)
		}
	}

	async function formatJson() {
		formatting.value = true
		try {
			const result = await formatJsonData()
			if (result.success) {
				message.success('JSON 格式化成功')
			} else {
				message.error(result.error || '格式化失败')
			}
		} catch {
			message.error('格式化过程中发生错误')
		} finally {
			formatting.value = false
		}
	}

	function clearInput() {
		clearEditor('input')
		clearEditor('output')
	}

	async function copyFormatted() {
		if (formattedJson.value) {
			const success = await copyToClipboard(formattedJson.value)
			if (success) {
				message.success('已复制到剪贴板')
			} else {
				message.error('复制失败')
			}
		}
	}

	return {
		inputJson,
		formattedJson,
		formatting,
		formatJson,
		clearInput,
		copyFormatted,
		initializeEditors,
	}
}
