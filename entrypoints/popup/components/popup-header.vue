<template>
	<div class="popup-header">
		<div class="header-content">
			<div class="logo-section">
				<div class="logo">
					<img src="/icon/48.png" alt="Voyage Tools" />
				</div>
				<div class="title-section">
					<h1 class="title">Voyage Tools</h1>
					<span class="version">v{{ version }}</span>
				</div>
			</div>
			<n-icon
				class="settings-icon"
				size="16"
				title="点击进入设置"
				@click="openSettings"
			>
				<SettingOutlined />
			</n-icon>
		</div>
		<div class="header-divider"></div>
	</div>
</template>

<script lang="ts" setup>
import { NIcon } from 'naive-ui'
import { SettingOutlined } from '@ant-design/icons-vue'

// 获取版本号
const version = __APP_VERSION__ || '1.0.0'

// 打开设置页面
const openSettings = () => {
	// 使用 Chrome 扩展 API 打开设置页面
	if (chrome?.runtime?.openOptionsPage) {
		chrome.runtime.openOptionsPage()
	} else {
		// 备用方法
		chrome.tabs.create({
			url: chrome.runtime.getURL('options.html'),
		})
	}
}
</script>

<style lang="less" scoped>
.popup-header {
	background: #ffffff;
	border-bottom: 1px solid #f0f0f0;
}

.header-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px 12px;
}

.logo-section {
	display: flex;
	align-items: center;
	gap: 16px;

	.logo {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.9);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.1),
			0 4px 16px rgba(102, 126, 234, 0.15),
			0 8px 32px rgba(102, 126, 234, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow:
				0 4px 12px rgba(0, 0, 0, 0.15),
				0 8px 24px rgba(102, 126, 234, 0.25),
				0 16px 48px rgba(102, 126, 234, 0.12),
				inset 0 1px 0 rgba(255, 255, 255, 0.5);
		}

		img {
			width: 100%;
			height: 100%;
			border-radius: 8px;
			object-fit: cover;
		}
	}
}

.title-section {
	display: flex;
	flex-direction: column;
	gap: 2px;

	.title {
		font-size: 18px;
		font-weight: 700;
		color: #262626;
		margin: 0;
		line-height: 1.2;
	}

	.version {
		font-size: 11px;
		color: #8c8c8c;
		font-weight: 500;
		background: #f5f5f5;
		padding: 2px 6px;
		border-radius: 4px;
		align-self: flex-start;
	}
}

.settings-icon {
	color: #666;
	cursor: pointer;
	padding: 6px;
	border-radius: 6px;
	transition: all 0.2s ease;

	&:hover {
		color: #1890ff;
		background: #f5f5f5;
		transform: translateY(-1px);
	}
}

.header-divider {
	height: 1px;
	background: linear-gradient(
		90deg,
		transparent,
		#f0f0f0 20%,
		#f0f0f0 80%,
		transparent
	);
}
</style>
