<template>
	<n-message-provider>
		<div class="json-factory-container">
			<div class="header">
				<h1 class="title">
					<span class="icon">🔧</span>
					JSON 工厂
				</h1>
			</div>

			<n-tabs
				v-model:value="activeTab"
				type="line"
				size="large"
				animated
				class="main-tabs"
			>
				<n-tab-pane name="format" tab="JSON 格式化">
					<JsonFormatter />
				</n-tab-pane>

				<n-tab-pane name="compress" tab="JSON 压缩">
					<JsonCompressor />
				</n-tab-pane>

				<n-tab-pane name="compare" tab="JSON 对比">
					<JsonComparator />
				</n-tab-pane>
			</n-tabs>
		</div>
	</n-message-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import JsonFormatter from './components/JsonFormatter.vue'
import JsonCompressor from './components/JsonCompressor.vue'
import JsonComparator from './components/JsonComparator.vue'

const activeTab = ref('format')
</script>

<style lang="less" scoped>
.json-factory-container {
	min-height: 100vh;
	background: #f7f5f0;
	padding: 24px;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	display: flex;
	flex-direction: column;
}

.header {
	text-align: center;
	margin-bottom: 32px;
	color: #2c3e50;
	flex-shrink: 0;

	.title {
		font-size: 2rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;

		.icon {
			font-size: 2.2rem;
			margin-right: 24px;
			animation: rotate 3s linear infinite;
		}
	}
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.main-tabs {
	max-width: 1800px;
	margin: 0 auto;
	background: #fefcf8;
	border-radius: 8px;
	border: 1px solid #e8e4dc;
	overflow: hidden;
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 600px;

	:deep(.n-tabs-nav) {
		background: #fefcf8;
		padding: 0 20px;
		border-bottom: 1px solid #e8e4dc;
		flex-shrink: 0;

		.n-tabs-tab {
			font-weight: 500;
			font-size: 0.95rem;
			padding: 14px 20px;
			color: #6b7280;
			transition: all 0.2s ease;

			&:hover {
				color: #374151;
			}

			&.n-tabs-tab--active {
				color: #111827;
				background: transparent;
				border-bottom: 2px solid #111827;
			}
		}
	}

	:deep(.n-tabs-pane) {
		padding: 0;
		flex: 1;
		overflow: hidden;
	}

	:deep(.n-tabs-content) {
		flex: 1;
		overflow: hidden;
	}
}

@media (max-width: 768px) {
	.json-factory-container {
		padding: 15px;
	}

	.header .title {
		font-size: 2rem;
	}
}
</style>
