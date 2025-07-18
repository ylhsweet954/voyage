<template>
	<div class="tab-content">
		<div class="tab-header">
			<h3>JSON 对比</h3>
			<p>比较两个 JSON 的差异</p>
		</div>
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

const compareAEditorRef = ref<HTMLElement>()
const compareBEditorRef = ref<HTMLElement>()

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
	initializeEditors
} = useJsonComparator(compareAEditorRef, compareBEditorRef)

onMounted(async () => {
	await nextTick()
	initializeEditors()
})
</script>

<style lang="less" scoped>
.tab-content {
	padding: 30px;
}

.tab-header {
	text-align: center;
	margin-bottom: 30px;

	h3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1e293b;
		margin: 0 0 8px 0;
	}

	p {
		color: #64748b;
		margin: 0;
		font-size: 0.95rem;
	}
}

.editor-container {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 20px;
	align-items: start;
}

.editor-panel {
	background: #f8fafc;
	border-radius: 12px;
	border: 2px solid #e2e8f0;
	overflow: hidden;
	transition: all 0.3s ease;

	&:hover {
		border-color: #cbd5e1;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.panel-header {
		background: white;
		padding: 12px 16px;
		border-bottom: 1px solid #e2e8f0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.panel-title {
			font-weight: 600;
			color: #374151;
			font-size: 0.9rem;
		}

		.panel-actions {
			display: flex;
			gap: 8px;
		}
	}

	.editor {
		height: 400px;
		border: none;

		:deep(.jsoneditor) {
			border: none;
			border-radius: 0;

			.jsoneditor-menu {
				background: #f1f5f9;
				border-bottom: 1px solid #e2e8f0;
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
	align-items: center;
	justify-content: center;
	padding: 20px 0;

	.action-button {
		height: 48px;
		padding: 0 32px;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
		}

		&:active {
			transform: translateY(0);
		}
	}
}

.compare-result {
	margin-top: 30px;

	:deep(.n-alert) {
		border-radius: 12px;
		border: none;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

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
		padding: 20px;
	}

	.editor-panel .editor {
		height: 300px;
	}

	.action-button {
		width: 100%;
	}
}
</style>
