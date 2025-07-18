import { ref, Ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useJsonEditor } from './useJsonEditor'

export function useJsonCompressor(
	compressInputEditorRef: Ref<HTMLElement | undefined>,
	compressOutputEditorRef: Ref<HTMLElement | undefined>
) {
	const compressing = ref(false)
	const message = useMessage()

	const {
		compressInputJson,
		compressedJson,
		initializeEditor,
		compressJsonData,
		copyToClipboard,
		clearEditor,
	} = useJsonEditor()

	function initializeEditors() {
		// 初始化压缩编辑器
		if (compressInputEditorRef.value) {
			initializeEditor(compressInputEditorRef.value, 'compressInput')
		}
		if (compressOutputEditorRef.value) {
			initializeEditor(compressOutputEditorRef.value, 'compressOutput', true)
		}
	}

	async function compressJson() {
		compressing.value = true
		try {
			const result = await compressJsonData()
			if (result.success) {
				message.success('JSON 压缩成功')
			} else {
				message.error(result.error || '压缩失败')
			}
		} catch {
			message.error('压缩过程中发生错误')
		} finally {
			compressing.value = false
		}
	}

	function clearCompressInput() {
		clearEditor('compressInput')
		clearEditor('compressOutput')
	}

	async function copyCompressed() {
		if (compressedJson.value) {
			const success = await copyToClipboard(compressedJson.value)
			if (success) {
				message.success('已复制到剪贴板')
			} else {
				message.error('复制失败')
			}
		}
	}

	return {
		compressInputJson,
		compressedJson,
		compressing,
		compressJson,
		clearCompressInput,
		copyCompressed,
		initializeEditors,
	}
}
