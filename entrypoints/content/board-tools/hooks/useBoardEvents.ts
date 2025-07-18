import { Ref } from 'vue'

export function useBoardEvents(
	tempNameList: Ref<string[]>,
	selectedIndices: Ref<number[]>,
	currentRandomText: Ref<string>,
	selectedName: Ref<string>,
	isBoardPage: Ref<boolean>,
	showNames: Ref<boolean>,
	loadData: () => void,
	selectPerson: (name: string) => void,
	clearSelection: () => void
) {
	let observer: MutationObserver

	/** 键盘右箭头触发随机 */
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') {
			e.preventDefault()
			window.clearTimeout(window as unknown as number)
			const debounceTimer: number = window.setTimeout(randomSelect, 300)
		}
	}

	/** 监视 board 容器加载完成后抓数据 */
	function addObserver() {
		if (observer) observer.disconnect()
		observer = new MutationObserver((muts) => {
			for (const m of muts) {
				for (const node of Array.from(m.addedNodes)) {
					if (
						node instanceof HTMLElement &&
						node.classList.contains('board-container')
					) {
						isBoardPage.value = true
						loadData()
					}
				}
			}
		})
		observer.observe(document.body, { childList: true, subtree: true })
	}

	/** 随机选一个 */
	function randomSelect() {
		if (tempNameList.value.length === 0) return
		if (selectedIndices.value.length >= tempNameList.value.length) {
			message.info('已结束一轮，现在重置...')
			selectedIndices.value = []
		}
		let idx: number
		do {
			idx = Math.floor(Math.random() * tempNameList.value.length)
		} while (selectedIndices.value.includes(idx))
		selectedIndices.value.push(idx)
		const name = tempNameList.value[idx]
		currentRandomText.value = `随机-当前:${name.replace(/\d/g, '')}`
		selectedName.value = name
		selectPerson(name)
	}

	/** 重置随机选择 */
	function resetRandomSelect() {
		selectedIndices.value = []
		selectedName.value = ''
		clearSelection()
	}

	function cleanup() {
		if (observer) observer.disconnect()
		document.removeEventListener('keydown', onKeydown)
	}

	return {
		onKeydown,
		addObserver,
		randomSelect,
		resetRandomSelect,
		cleanup,
	}
}
