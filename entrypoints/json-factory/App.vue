<template>
	<n-message-provider>
		<div class="json-factory-container">
			<div class="header">
				<h1 class="title">
					<span class="icon">🔧</span>
					JSON 工厂
				</h1>
				<p class="subtitle">强大的 JSON 处理工具集</p>
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
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 24px;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
	text-align: center;
	margin-bottom: 30px;
	color: white;

	.title {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 10px 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;

		.icon {
			font-size: 2.2rem;
			animation: rotate 3s linear infinite;
		}
	}

	.subtitle {
		font-size: 1.1rem;
		opacity: 0.9;
		margin: 0;
		font-weight: 300;
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
	background: white;
	border-radius: 16px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	overflow: hidden;

	:deep(.n-tabs-nav) {
		background: #f8fafc;
		padding: 0 20px;
		border-bottom: 1px solid #e2e8f0;

		.n-tabs-tab {
			font-weight: 600;
			font-size: 1rem;
			padding: 16px 24px;
			color: #64748b;
			transition: all 0.3s ease;

			&:hover {
				color: #3b82f6;
			}

			&.n-tabs-tab--active {
				color: #3b82f6;
				background: white;
				border-radius: 8px 8px 0 0;
				margin-bottom: -1px;
				border-bottom: 2px solid #3b82f6;
			}
		}
	}

	:deep(.n-tabs-pane) {
		padding: 0;
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
