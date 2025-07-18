<template>
	<div class="sub-feature-item">
		<div class="sub-feature-info">
			<div class="sub-feature-label">{{ subFeature.label }}</div>
			<div class="sub-feature-description">
				{{ subFeature.description }}
			</div>
		</div>
		<div class="sub-feature-toggle">
			<n-switch
				:value="subFeature.enabled"
				size="small"
				@update:value="(val: boolean) => $emit('change', val, subFeature)"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { SubFeature } from '@/entrypoints/types'

interface Props {
	subFeature: SubFeature
}

defineProps<Props>()

defineEmits<{
	change: [val: boolean, subFeature: SubFeature]
}>()
</script>

<style lang="less" scoped>
.sub-feature-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	background: #f8f9fa;
	border-radius: 6px;
	border: 1px solid #e8e8e8;

	.sub-feature-info {
		flex: 1;

		.sub-feature-label {
			font-size: 13px;
			font-weight: 500;
			color: #262626;
			margin-bottom: 2px;
		}

		.sub-feature-description {
			font-size: 11px;
			color: #8c8c8c;
			line-height: 1.3;
		}
	}

	.sub-feature-toggle {
		flex-shrink: 0;
		margin-left: 12px;
	}
}
</style>
