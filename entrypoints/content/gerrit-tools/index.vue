<template>
	<!-- 不需要添加内容，js实现 -->
	<div class="gerrit-tools"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

function addApproveBtn() {
	if (document.getElementById('approveButton')) return
	const postBtn = document.querySelector<HTMLButtonElement>(
		'button[title="Post reply (Shortcut: Ctrl-Enter)"]'
	)
	if (!postBtn) return

	const btn = document.createElement('button')
	btn.id = 'approveButton'
	btn.innerText = '一键审批通过'
	btn.className = 'ylh-approve-btn'
	btn.onclick = () => {
		const textArea =
			document.querySelector<HTMLTextAreaElement>('.gwt-TextArea')
		if (!textArea) return
		if (!textArea.value) {
			const result = window.confirm(
				'审批结果未填哟，是否自动填充“代码无明显问题，审批通过，可以合入”？'
			)
			if (!result) return
			textArea.value = '代码无明显问题，审批通过，可以合入'
		}

		getTargetRadio(1, 5, 'Code-Review')?.click()
		getTargetRadio(2, 5, 'Verified')?.click()
		getTargetRadio(3, 4, 'Workflow')?.click()
		postBtn.click()

		setTimeout(() => {
			const submitBtn = document.querySelector<HTMLElement>(
				'.com-google-gerrit-client-change-Actions_BinderImpl_GenCss_style-submit'
			)
			submitBtn?.textContent && submitBtn.click()
		}, 1500)
	}

	postBtn.parentNode?.insertBefore(btn, postBtn.nextSibling)
}

function addCommentBtn(node: HTMLTextAreaElement) {
	const saveBtn = document.querySelector<HTMLButtonElement>(
		'button[title="Save this draft comment'
	)
	if (!saveBtn) return

	const btn = document.createElement('button')
	btn.innerText = '补全+save'
	btn.className = 'ylh-coment-btn'
	btn.style.cssText = 'width: 70px; height: 20px; font-size: 12px;'
	let ctrlTime = 0
	let spaceTime = 1

	document.addEventListener('keydown', function (event) {
		if (event.ctrlKey) ctrlTime = event.timeStamp
		if (event.code === 'Space') spaceTime = event.timeStamp
		if (ctrlTime === spaceTime) {
			addComment(saveBtn)
			ctrlTime = 0
			spaceTime = 1
		}
	})

	btn.onclick = () => addComment(saveBtn)
	node.parentNode?.insertBefore(btn, node.nextSibling)
}

function addComment(saveBtn: HTMLButtonElement) {
	const textArea = document.querySelector<HTMLTextAreaElement>(
		'.com-google-gerrit-client-diff-DraftBox_BinderImpl_GenCss_style-editArea'
	)
	if (!textArea) return
	textArea.value += ' 没有发现明显问题，ok'
	navigator.clipboard.writeText(textArea.value)
	saveBtn.click()
}

function getTargetRadio(
	tr: number,
	td: number,
	name: string
): HTMLInputElement | null {
	const tbody = document.querySelector(
		'.com-google-gerrit-client-change-Resources-Style-section tbody'
	)
	const trEl = tbody?.querySelectorAll('tr')[tr]
	const tdEl = trEl?.querySelectorAll('td')[td]
	const span = tdEl?.querySelector('span')
	return span?.querySelector<HTMLInputElement>(`input[name="${name}"]`) ?? null
}

function setupObserver() {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType !== Node.ELEMENT_NODE) return
				const el = node as HTMLElement

				if (
					el.tagName === 'DIV' &&
					el.className ===
						'com-google-gerrit-client-change-ChangeScreen_BinderImpl_GenCss_style-replyBox'
				) {
					addApproveBtn()
				}

				if (
					el.tagName === 'TEXTAREA' &&
					el.className ===
						'com-google-gerrit-client-diff-DraftBox_BinderImpl_GenCss_style-editArea'
				) {
					const hasBtn = Array.from(el.parentNode?.children || []).some(
						(child) =>
							(child as HTMLElement).classList?.contains('ylh-coment-btn')
					)
					if (!hasBtn) addCommentBtn(el)
				}
			})
		})
	})

	observer.observe(document, { childList: true, subtree: true })
}

onMounted(() => {
	const gerritRegex = /gerrit\.zte\.com\.cn\/#\/c\/\d+\/\d+\//
	const gitlabRegex = /gitlab\.zte\.com\.cn(?::\d+)?\/person\/#\/c\/\d{5}\//

	if (gerritRegex.test(location.href) || gitlabRegex.test(location.href)) {
		setupObserver()
	}

	// 处理前进后退触发的变动
	window.onpopstate = () => {
		setupObserver()
	}
})
</script>

<style lang="less" scoped>
/* 可根据需要美化按钮 */
</style>
