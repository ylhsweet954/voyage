<template>
	<div class="tab-content">
		<div class="tab-header">
			<h3>JSON 格式化</h3>
			<p>将压缩的 JSON 转换为易读的格式</p>
		</div>
		<div class="editor-container">
			<div class="editor-panel">
				<div class="panel-header">
					<span class="panel-title">输入 JSON</span>
					<n-button
						size="small"
						secondary
						:disabled="!inputJson"
						@click="clearInput"
					>
						清空
					</n-button>
				</div>
				<div ref="inputEditorRef" class="editor"></div>
			</div>
			<div class="action-panel">
				<div class="format-options">
					<n-select
						v-model:value="indentSize"
						:options="indentOptions"
						size="small"
						style="width: 120px; margin-bottom: 12px"
					/>
				</div>
				<n-button
					type="primary"
					size="large"
					:loading="formatting"
					:disabled="!inputJson"
					class="action-button"
					@click="formatJson"
				>
					<template #icon>
						<span>✨</span>
					</template>
					格式化
				</n-button>
			</div>
			<div class="editor-panel">
				<div class="panel-header">
					<span class="panel-title">格式化结果</span>
					<n-button
						size="small"
						secondary
						:disabled="!formattedJson"
						@click="copyFormatted"
					>
						复制
					</n-button>
				</div>
				<div ref="outputEditorRef" class="editor"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { useJsonFormatter } from '../hooks/useJsonFormatter'

const inputEditorRef = ref<HTMLElement>()
const outputEditorRef = ref<HTMLElement>()

// 缩进选项
const indentSize = ref(2)
const indentOptions = [
	{ label: '2 空格', value: 2 },
	{ label: '4 空格', value: 4 },
	{ label: '制表符', value: '\t' },
]

const {
	inputJson,
	formattedJson,
	formatting,
	formatJson,
	clearInput,
	copyFormatted,
	initializeEditors,
} = useJsonFormatter(inputEditorRef, outputEditorRef, indentSize)

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
				font-size: 14px;
				line-height: 1.6;
				background: #ffffff !important;
			}

			// 确保代码模式下的文本选择和复制体验
			.ace_editor {
				background: #ffffff !important;
			}

			.ace_gutter {
				background: #f8fafc !important;
				border-right: 1px solid #e2e8f0;
			}

			.ace_content {
				background: #ffffff !important;
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

	.format-options {
		margin-bottom: 16px;
		text-align: center;

		:deep(.n-base-selection) {
			border-radius: 8px;
			border: 2px solid #e2e8f0;
			transition: all 0.3s ease;

			&:hover {
				border-color: #cbd5e1;
			}

			&.n-base-selection--focus {
				border-color: #3b82f6;
				box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
			}
		}
	}

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
