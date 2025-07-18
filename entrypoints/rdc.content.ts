export default defineContentScript({
	matches: ['*://rdcloud.zte.com.cn/*'],
	async main() {
		console.log('⛵ Voyage 启航中... 正在注入脚本 🌊')
		await injectScript('/xhr-hook.js', {
			keepInDom: true,
		})
		console.log('🚢 Voyage 航行完成！⚓ 脚本注入成功 ⭐')
	},
})
