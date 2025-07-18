import { Ref } from 'vue'

export function useBoardDOM(
	nameList: Ref<string[]>,
	tempNameList: Ref<string[]>,
	selectedName: Ref<string>,
	currentRandomText: Ref<string>,
	isLoading: Ref<boolean>
) {
	/** 滚动抓取所有卡片用户名 */
	function loadData() {
		isLoading.value = true
		const board = document.querySelector<HTMLElement>('.board-container')
		if (!board) {
			isLoading.value = false
			return
		}
		board.scrollTop = 0
		let step = 1
		const interval = window.setInterval(() => {
			if (board.scrollTop + board.clientHeight + 5 >= board.scrollHeight) {
				window.clearInterval(interval)
				// 回顶
				board.scrollTop = Math.max(0, board.scrollTop - 200 * step)
				// 收集姓名
				const cards = Array.from(
					document.querySelectorAll<HTMLElement>('div.card.myCard .over-hidden')
				)
				const names = cards.map((c) => c.textContent?.trim() || '')
				const unique = Array.from(new Set([...nameList.value, ...names]))
				tempNameList.value = unique
				isLoading.value = false
			} else {
				step += 1
				board.scrollTop += 200
			}
		}, 50)
	}

	/** 点击某人：只显示匹配卡片 */
	function selectPerson(name: string) {
		selectedName.value = name
		currentRandomText.value = `随机-当前:${name.replace(/\d/g, '')}`
		const cards = document.querySelectorAll<HTMLElement>('div.card.myCard')
		cards.forEach((c) => {
			c.style.display = c.textContent?.includes(name) ? 'block' : 'none'
		})
		const board = document.querySelector<HTMLElement>('.board-container')
		if (board) board.scrollTop = 0
	}

	/** 清空所有筛选效果 */
	function clearSelection() {
		currentRandomText.value = '随机一位'
		selectedName.value = ''
		const cards = document.querySelectorAll<HTMLElement>('div.card.myCard')
		cards.forEach((c) => (c.style.display = 'block'))
	}

	return {
		loadData,
		selectPerson,
		clearSelection,
	}
}
