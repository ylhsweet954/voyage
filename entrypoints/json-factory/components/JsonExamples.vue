<template>
	<div class="examples-section">
		<div class="examples-content">
			<span class="examples-title">📚 示例</span>
			<div class="examples-buttons">
				<n-button
					v-for="example in examples"
					:key="example.key"
					size="tiny"
					type="tertiary"
					class="example-btn"
					@click="$emit('loadExample', example.key)"
				>
					{{ example.icon }} {{ example.label }}
				</n-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
interface ExampleItem {
	key: string
	icon: string
	label: string
}

interface Props {
	examples?: ExampleItem[]
}

withDefaults(defineProps<Props>(), {
	examples: () => [
		{ key: 'xiuxian', icon: '🗡️', label: '凡人修仙传' },
		{ key: 'ai-tools', icon: '🤖', label: 'AI工具信息' },
		{ key: 'c9-universities', icon: '🎓', label: 'C9院校信息' },
	],
})

defineEmits<{
	loadExample: [key: string]
}>()
</script>

<style lang="less" scoped>
.examples-section {
	background: #f8fafc;
	border-radius: 8px;
	padding: 8px 12px;
	margin-bottom: 12px;
	border: 1px solid #e2e8f0;

	.examples-content {
		display: flex;
		align-items: center;
		gap: 12px;

		.examples-title {
			font-size: 0.85rem;
			font-weight: 500;
			color: #64748b;
			white-space: nowrap;
		}

		.examples-buttons {
			display: flex;
			gap: 6px;
			flex-wrap: wrap;

			.example-btn {
				border-radius: 4px;
				font-size: 0.75rem;
				font-weight: 400;
				transition: all 0.2s ease;
				border: 1px solid #cbd5e1;
				background: white;
				padding: 4px 8px;
				height: auto;

				&:hover {
					border-color: #3b82f6;
					color: #3b82f6;
				}
			}
		}
	}
}

@media (max-width: 768px) {
	.examples-section {
		padding: 6px 10px;
		margin-bottom: 10px;

		.examples-content {
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;

			.examples-buttons {
				gap: 4px;

				.example-btn {
					font-size: 0.7rem;
					padding: 3px 6px;
				}
			}
		}
	}
}
</style>
