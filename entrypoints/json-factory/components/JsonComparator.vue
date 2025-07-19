<template>
	<div class="tab-content">
		<!-- 示例按钮区域 -->
		<JsonExamples
			:examples="compareExamples"
			@load-example="loadCompareExample"
		/>

		<div class="editor-container">
			<div class="editor-panel">
				<div class="panel-header">
					<span class="panel-title">JSON A</span>
					<div class="panel-actions">
						<n-button
							size="small"
							secondary
							:disabled="!compareJsonA"
							@click="formatCompareJsonA"
						>
							格式化
						</n-button>
						<n-button
							size="small"
							secondary
							:disabled="!compareJsonA"
							@click="clearCompareA"
						>
							清空
						</n-button>
					</div>
				</div>
				<div ref="compareAEditorRef" class="editor"></div>
			</div>
			<div class="action-panel">
				<div class="action-description">
					<span class="description-text">比较两个 JSON 的差异</span>
				</div>
				<n-button
					type="primary"
					size="large"
					:loading="comparing"
					:disabled="!compareJsonA || !compareJsonB"
					class="action-button"
					@click="compareJson"
				>
					<template #icon>
						<span>🔍</span>
					</template>
					对比
				</n-button>
			</div>
			<div class="editor-panel">
				<div class="panel-header">
					<span class="panel-title">JSON B</span>
					<div class="panel-actions">
						<n-button
							size="small"
							secondary
							:disabled="!compareJsonB"
							@click="formatCompareJsonB"
						>
							格式化
						</n-button>
						<n-button
							size="small"
							secondary
							:disabled="!compareJsonB"
							@click="clearCompareB"
						>
							清空
						</n-button>
					</div>
				</div>
				<div ref="compareBEditorRef" class="editor"></div>
			</div>
		</div>
		<div v-if="compareResult" class="compare-result">
			<n-alert type="info" title="对比结果" closable>
				<div v-html="compareResult"></div>
			</n-alert>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useJsonComparator } from '../hooks/useJsonComparator'
import { getCompareExample } from '../data/examples'
import JsonExamples from './JsonExamples.vue'

const compareAEditorRef = ref<HTMLElement>()
const compareBEditorRef = ref<HTMLElement>()

// 对比示例配置
const compareExamples = [
	{ key: 'xiuxian', icon: '🗡️', label: '凡人修仙传对比' },
	{ key: 'ai-tools', icon: '🤖', label: 'AI工具对比' },
	{ key: 'c9-universities', icon: '🎓', label: 'C9院校对比' },
]

const {
	compareJsonA,
	compareJsonB,
	comparing,
	compareResult,
	compareJson,
	formatCompareJsonA,
	formatCompareJsonB,
	clearCompareA,
	clearCompareB,
	initializeEditors,
	setEditorContent,
} = useJsonComparator(compareAEditorRef, compareBEditorRef)

// 加载对比示例数据
function loadCompareExample(exampleKey: string) {
	const { original, modified } = getCompareExample(
		exampleKey as 'xiuxian' | 'ai-tools' | 'c9-universities'
	)
	setEditorContent('compareA', original)
	setEditorContent('compareB', modified)
}

onMounted(async () => {
	await nextTick()
	initializeEditors()
})
</script>

<style lang="less" scoped>
.tab-content {
	padding: 20px 30px;
	min-height: 100%;
	display: flex;
	flex-direction: column;
}

.editor-container {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 20px;
	align-items: start;
	flex: 1;
	min-height: 0;
}

.editor-panel {
	background: white;
	border-radius: 6px;
	border: 1px solid #e5e7eb;
	overflow: hidden;
	transition: border-color 0.2s ease;

	&:hover {
		border-color: #d1d5db;
	}

	.panel-header {
		background: #f9fafb;
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.panel-title {
			font-weight: 500;
			color: #374151;
			font-size: 0.9rem;
		}

		.panel-actions {
			display: flex;
			gap: 8px;
		}
	}

	.editor {
		height: 550px;
		min-height: 450px;
		max-height: calc(100vh - 350px);
		border: none;

		:deep(.jsoneditor) {
			border: none;
			border-radius: 0;

			.jsoneditor-menu {
				background: #f9fafb;
				border-bottom: 1px solid #e5e7eb;
			}

			.ace-jsoneditor {
				font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
				font-size: 13px;
				line-height: 1.5;
			}
		}
	}
}

.action-panel {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px 0;

	.action-description {
		margin-bottom: 12px;

		.description-text {
			font-size: 0.85rem;
			color: #64748b;
			font-weight: 500;
		}
	}

	.action-button {
		height: 44px;
		padding: 0 24px;
		font-size: 0.95rem;
		font-weight: 500;
		border-radius: 6px;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-1px);
		}

		&:active {
			transform: translateY(0);
		}
	}
}

.compare-result {
	margin-top: 20px;
	flex-shrink: 0;
	max-height: 200px;
	overflow-y: auto;

	:deep(.n-alert) {
		border-radius: 6px;
		border: 1px solid #e5e7eb;

		.n-alert__content {
			font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
			font-size: 0.9rem;
			line-height: 1.6;
		}
	}
}

// 响应式设计
@media (max-width: 1200px) {
	.editor-container {
		grid-template-columns: 1fr;
		gap: 20px;
	}

	.action-panel {
		order: 2;
		padding: 15px 0;
	}

	.editor-panel:first-child {
		order: 1;
	}

	.editor-panel:last-child {
		order: 3;
	}
}

@media (max-width: 768px) {
	.tab-content {
		padding: 15px;
	}

	.editor-panel .editor {
		height: calc(40vh - 80px);
	}

	.action-button {
		width: 100%;
	}
}
</style>
