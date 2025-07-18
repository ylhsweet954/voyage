import { ref, Ref } from 'vue'
import JSONEditor, { JSONEditorOptions } from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

export function useJsonEditor(indentSize?: Ref<number | string>) {
	// 响应式数据
	const inputJson = ref('')
	const formattedJson = ref('')
	const compressInputJson = ref('')
	const compressedJson = ref('')
	const compareJsonA = ref('')
	const compareJsonB = ref('')

	// 编辑器实例存储
	const editors = new Map<string, JSONEditor>()

	/**
	 * 初始化编辑器
	 */
	function initializeEditor(
		container: HTMLElement,
		type: string,
		readOnly: boolean = false
	) {
		const options: JSONEditorOptions = {
			mode: 'code' as const,
			theme: 'ace/theme/github',
			indentation: 4,
			onChange: () => {
				try {
					const editor = editors.get(type)
					if (editor) {
						const text = editor.getText()
						updateJsonData(type, text)
					}
				} catch (error) {
					console.warn('Editor onChange error:', error)
				}
			},
			onError: (error: Error) => {
				console.warn('JSON Editor error:', error)
			},
		}

		if (readOnly) {
			Object.assign(options, {
				mode: 'code' as const,
				mainMenuBar: false,
				navigationBar: false,
				readOnly: true,
				// 确保只读编辑器有更好的显示效果
				statusBar: false,
			})
		}

		// 为压缩输出编辑器特殊配置，确保单行显示
		if (type === 'compressOutput') {
			Object.assign(options, {
				mode: 'text' as const,
				mainMenuBar: false,
				navigationBar: false,
			})
		}

		const editor = new JSONEditor(container, options)
		editors.set(type, editor)

		// 设置初始内容
		try {
			editor.setText('')
		} catch (error) {
			console.warn('Failed to set initial text:', error)
		}
	}

	/**
	 * 更新对应的响应式数据
	 */
	function updateJsonData(type: string, text: string) {
		switch (type) {
			case 'input':
				inputJson.value = text
				break
			case 'output':
				formattedJson.value = text
				break
			case 'compressInput':
				compressInputJson.value = text
				break
			case 'compressOutput':
				compressedJson.value = text
				break
			case 'compareA':
				compareJsonA.value = text
				break
			case 'compareB':
				compareJsonB.value = text
				break
		}
	}

	/**
	 * 设置编辑器内容
	 */
	function setEditorContent(type: string, content: string) {
		const editor = editors.get(type)
		if (editor) {
			try {
				editor.setText(content)
				// 手动更新对应的响应式状态，因为 setText 不会触发 onChange 事件
				updateJsonData(type, content)
			} catch (error) {
				console.warn('Failed to set editor content:', error)
			}
		}
	}

	/**
	 * 格式化 JSON
	 */
	async function formatJsonData(): Promise<{
		success: boolean
		error?: string
	}> {
		try {
			if (!inputJson.value.trim()) {
				return { success: false, error: '请输入 JSON 内容' }
			}

			const parsed = JSON.parse(inputJson.value)
			// 使用动态缩进，默认为 4 个空格
			const indent = indentSize?.value || 4
			const formatted = JSON.stringify(parsed, null, indent)

			setEditorContent('output', formatted)
			formattedJson.value = formatted

			return { success: true }
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '格式化失败'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * 压缩 JSON
	 */
	async function compressJsonData(): Promise<{
		success: boolean
		error?: string
	}> {
		try {
			if (!compressInputJson.value.trim()) {
				return { success: false, error: '请输入 JSON 内容' }
			}

			const parsed = JSON.parse(compressInputJson.value)
			const compressed = JSON.stringify(parsed)

			setEditorContent('compressOutput', compressed)
			compressedJson.value = compressed

			return { success: true }
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '压缩失败'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * 对比 JSON
	 */
	async function compareJsonData(): Promise<{
		success: boolean
		result?: string
		error?: string
	}> {
		try {
			if (!compareJsonA.value.trim() || !compareJsonB.value.trim()) {
				return { success: false, error: '请输入两个 JSON 进行对比' }
			}

			const jsonA = JSON.parse(compareJsonA.value)
			const jsonB = JSON.parse(compareJsonB.value)

			// 简单的对比逻辑
			const differences = findDifferences(jsonA, jsonB)
			const result = formatDifferences(differences)

			return { success: true, result }
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : '对比失败'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * 查找差异
	 */
	function findDifferences(objA: any, objB: any, path: string = ''): string[] {
		const differences: string[] = []

		if (typeof objA !== typeof objB) {
			differences.push(`${path}: 类型不同 (${typeof objA} vs ${typeof objB})`)
			return differences
		}

		if (objA === null || objB === null) {
			if (objA !== objB) {
				differences.push(`${path}: 值不同 (${objA} vs ${objB})`)
			}
			return differences
		}

		if (typeof objA !== 'object') {
			if (objA !== objB) {
				differences.push(`${path}: 值不同 (${objA} vs ${objB})`)
			}
			return differences
		}

		const keysA = Object.keys(objA)
		const keysB = Object.keys(objB)
		const allKeys = new Set([...keysA, ...keysB])

		for (const key of allKeys) {
			const newPath = path ? `${path}.${key}` : key

			if (!(key in objA)) {
				differences.push(`${newPath}: 仅在 JSON B 中存在`)
			} else if (!(key in objB)) {
				differences.push(`${newPath}: 仅在 JSON A 中存在`)
			} else {
				differences.push(...findDifferences(objA[key], objB[key], newPath))
			}
		}

		return differences
	}

	/**
	 * 格式化差异结果
	 */
	function formatDifferences(differences: string[]): string {
		if (differences.length === 0) {
			return '<p style="color: #18a058;">✅ 两个 JSON 完全相同</p>'
		}

		const html = differences
			.map((diff) => `<p style="color: #d03050;">❌ ${diff}</p>`)
			.join('')

		return `<div><p><strong>发现 ${differences.length} 处差异：</strong></p>${html}</div>`
	}

	/**
	 * 复制到剪贴板
	 */
	async function copyToClipboard(text: string): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(text)
			return true
		} catch (error) {
			console.warn('Failed to copy to clipboard:', error)
			return false
		}
	}

	/**
	 * 清空编辑器内容
	 */
	function clearEditor(type: string) {
		setEditorContent(type, '')
		updateJsonData(type, '')
	}

	return {
		// 响应式数据
		inputJson,
		formattedJson,
		compressInputJson,
		compressedJson,
		compareJsonA,
		compareJsonB,

		// 方法
		initializeEditor,
		formatJsonData,
		compressJsonData,
		compareJsonData,
		copyToClipboard,
		clearEditor,
		setEditorContent,
	}
}
