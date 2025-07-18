<template>
	<div class="other-settings">
		<div class="settings-card">
			<div class="card-header">
				<div class="header-icon">⚙️</div>
				<div class="header-title">
					<h3>其他设置</h3>
					<span class="header-desc">扩展功能和外部工具</span>
				</div>
			</div>

			<div class="tools-section">
				<div class="tool-item">
					<div class="tool-info">
						<div class="tool-title">自动化用例数据</div>
						<div class="tool-desc">管理和查看自动化测试用例数据</div>
					</div>
					<n-button type="primary" size="small" @click="openPage">
						打开页面
					</n-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const openPage = () => {
	chrome.tabs.create({
		url: chrome.runtime.getURL('playground.html'),
	})
}
</script>

<style scoped>
.other-settings {
	padding: 8px 0;
}

.settings-card {
	background: #ffffff;
	border: 1px solid #f0f0f0;
	border-radius: 12px;
	padding: 20px;
}

.card-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.header-icon {
	font-size: 20px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f6ffed;
	border-radius: 6px;
}

.header-title h3 {
	margin: 0 0 2px 0;
	font-size: 16px;
	font-weight: 600;
	color: #262626;
}

.header-desc {
	font-size: 12px;
	color: #8c8c8c;
}

.tools-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.tool-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background: #fafafa;
	border: 1px solid #f0f0f0;
	border-radius: 8px;
}

.tool-info {
	flex: 1;
}

.tool-title {
	font-size: 14px;
	font-weight: 500;
	color: #262626;
	margin-bottom: 4px;
}

.tool-desc {
	font-size: 12px;
	color: #8c8c8c;
}
</style>
