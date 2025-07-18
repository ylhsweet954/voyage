<template>
	<div class="cache-settings">
		<div class="settings-card">
			<div class="card-header">
				<div class="header-icon">🗄️</div>
				<div class="header-title">
					<h3>缓存管理</h3>
					<span class="header-desc">操作不可恢复，请谨慎操作。</span>
				</div>
			</div>

			<div class="cache-items-section">
				<div v-for="item in cacheItems" :key="item.key" class="cache-item">
					<div class="item-info">
						<div class="item-name">{{ item.name }}</div>
						<div class="item-desc">{{ item.description }}</div>
					</div>
					<n-button
						type="error"
						size="small"
						@click="clearSingleCache(item.key, item.name)"
					>
						🗑️ 清空
					</n-button>
				</div>
			</div>

			<div class="action-section">
				<n-button type="error" size="medium" @click="clearAllPluginCache">
					🗑️ 清空所有缓存
				</n-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { storage } from 'wxt/storage'
import message from '@/components/message'

// 缓存项配置
const cacheItems = [
	{
		key: 'local:featureConfig',
		name: '功能配置',
		description: '插件功能开关和配置信息',
	},
	{
		key: 'local:AIConfig',
		name: 'AI配置',
		description: 'AI相关配置和设置',
	},
	{
		key: 'local:cachedEmps',
		name: '员工缓存',
		description: '缓存的员工数据信息',
	},
	{
		key: 'local:dtTestCenterData',
		name: '测试中心数据',
		description: '测试中心相关的缓存数据',
	},
]

// 清空单个缓存
const clearSingleCache = async (key: string, name: string) => {
	try {
		await storage.removeItem(key)
		message.success(`${name} 缓存已清空`)
	} catch (error) {
		console.error(`清空${name}缓存时出错:`, error)
		message.error(`清空${name}缓存失败`)
	}
}

// 清空所有插件缓存
const clearAllPluginCache = async () => {
	try {
		await storage.removeItems([
			'local:featureConfig',
			'local:AIConfig',
			'local:cachedEmps',
			'local:dtTestCenterData',
		])
		message.success('所有缓存已清空')
	} catch (error) {
		console.error('清空缓存时出错:', error)
		message.error('清空缓存失败')
	}
}
</script>

<style lang="less" scoped>
.cache-settings {
	padding: 8px 0;

	.settings-card {
		background: #ffffff;
		border: 1px solid #f0f0f0;
		border-radius: 12px;
		padding: 20px;

		.card-header {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 16px;

			.header-icon {
				font-size: 20px;
				width: 32px;
				height: 32px;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #fff7e6;
				border-radius: 6px;
			}

			.header-title {
				h3 {
					margin: 0 0 2px 0;
					font-size: 16px;
					font-weight: 600;
					color: #262626;
				}
			}

			.header-desc {
				font-size: 12px;
				color: #8c8c8c;
			}
		}

		.cache-items-section {
			margin-bottom: 20px;

			.cache-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 12px 16px;
				border: 1px solid #f0f0f0;
				border-radius: 8px;
				margin-bottom: 8px;
				background: #fafafa;

				&:last-child {
					margin-bottom: 0;
				}

				.item-info {
					flex: 1;

					.item-name {
						font-size: 14px;
						font-weight: 500;
						color: #262626;
						margin-bottom: 2px;
					}

					.item-desc {
						font-size: 12px;
						color: #8c8c8c;
					}
				}
			}
		}

		.action-section {
			display: flex;
			justify-content: center;
			padding-top: 8px;
			border-top: 1px solid #f0f0f0;
		}
	}
}
</style>
