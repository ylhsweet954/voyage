<template>
	<div class="tab-content">
		<!-- 示例按钮区域 -->
		<JsonExamples @load-example="loadExample" />

		<div class="editor-container">
			<div class="editor-panel">
				<div class="panel-header">
					<span class="panel-title">输入 JSON</span>
					<n-button
						size="small"
						secondary
						:disabled="!compressInputJson"
						@click="clearCompressInput"
					>
						清空
					</n-button>
				</div>
				<div ref="compressInputEditorRef" class="editor"></div>
			</div>
			<div class="action-panel">
				<div class="action-description">
					<span class="description-text">将格式化的 JSON 压缩为单行</span>
				</div>
				<n-button
					type="primary"
					size="large"
					:loading="compressing"
					:disabled="!compressInputJson"
					class="action-button"
					@click="compressJson"
				>
					<template #icon>
						<span>📦</span>
					</template>
					压缩
				</n-button>
			</div>
			<div class="editor-panel">
				<div class="panel-header">
					<span class="panel-title">压缩结果</span>
					<n-button
						size="small"
						secondary
						:disabled="!compressedJson"
						@click="copyCompressed"
					>
						复制
					</n-button>
				</div>
				<div ref="compressOutputEditorRef" class="editor"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useJsonCompressor } from '../hooks/useJsonCompressor'
import { getFormattedExample } from '../data/examples'
import JsonExamples from './JsonExamples.vue'

const compressInputEditorRef = ref<HTMLElement>()
const compressOutputEditorRef = ref<HTMLElement>()

const {
	compressInputJson,
	compressedJson,
	compressing,
	compressJson,
	clearCompressInput,
	copyCompressed,
	initializeEditors,
	setEditorContent,
} = useJsonCompressor(compressInputEditorRef, compressOutputEditorRef)

// 加载示例数据
function loadExample(exampleKey: string) {
	const exampleData = getFormattedExample(
		exampleKey as 'xiuxian' | 'ai-tools' | 'c9-universities'
	)
	setEditorContent('compressInput', exampleData)
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
	}

	.editor {
		height: 600px;
		min-height: 500px;
		max-height: calc(100vh - 300px);
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
		height: calc(50vh - 100px);
	}

	.action-button {
		width: 100%;
	}
}
</style>
