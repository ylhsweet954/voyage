<template>
	<div class="feature-card" :class="{ 'feature-disabled': !feature.enabled }">
		<div class="feature-header">
			<div class="feature-icon">{{ feature.icon }}</div>
			<div class="feature-title">
				<h3>{{ feature.label }}</h3>
				<div class="feature-meta">
					<span class="feature-category">{{ feature.category }}</span>
					<n-tag
						:type="feature.enabled ? 'success' : 'default'"
						size="small"
						round
					>
						{{ feature.enabled ? '已启用' : '已禁用' }}
					</n-tag>
				</div>
			</div>
			<div class="feature-toggle">
				<n-switch
					:value="feature.enabled"
					size="small"
					@update:value="(val: boolean) => $emit('change', val, feature)"
				/>
			</div>
		</div>

		<div class="feature-description">
			{{ feature.description }}
		</div>

		<div
			v-if="feature.subFeatures && feature.subFeatures.length > 0"
			class="feature-sub-features"
		>
			<div class="sub-features-title">子功能配置：</div>
			<div class="sub-features-list">
				<SubFeatureCard
					v-for="(subFeature, subIdx) in feature.subFeatures"
					:key="subIdx"
					:sub-feature="subFeature"
					@change="
						(val: boolean, subFeature: SubFeature) =>
							$emit('sub-feature-change', val, subFeature)
					"
				/>
			</div>
		</div>

		<div v-if="feature.usage && feature.usage.length > 0" class="feature-usage">
			<div class="usage-title" @click="$emit('toggle-usage')">
				<span>主要功能：</span>
				<n-icon
					:class="['usage-toggle-icon', { expanded: feature.showUsage }]"
					size="14"
				>
					<svg viewBox="0 0 16 16" fill="currentColor">
						<path d="M8 11L3 6h10l-5 5z" />
					</svg>
				</n-icon>
			</div>
			<div class="usage-content" :class="{ expanded: feature.showUsage }">
				<ul class="usage-list">
					<li v-for="(usage, idx) in feature.usage" :key="idx">
						{{ usage }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Feature, SubFeature } from '@/entrypoints/types'
import SubFeatureCard from './sub-feature-card.vue'

interface Props {
	feature: Feature
}

defineProps<Props>()

defineEmits<{
	change: [val: boolean, feature: Feature]
	'sub-feature-change': [val: boolean, subFeature: SubFeature]
	'toggle-usage': []
}>()
</script>

<style lang="less" scoped>
.feature-card {
	background: #ffffff;
	border: 1px solid #f0f0f0;
	border-radius: 12px;
	padding: 12px 18px 0px;
	transition: all 0.3s ease;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

	&:hover {
		border-color: #d9d9d9;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	&.feature-disabled {
		opacity: 0.6;
		background: #fafafa;
	}

	.feature-header {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 12px;

		.feature-icon {
			font-size: 24px;
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f8f9fa;
			border-radius: 8px;
			flex-shrink: 0;
		}

		.feature-title {
			flex-grow: 1;

			h3 {
				margin: 0 0 6px 0;
				font-size: 16px;
				font-weight: 600;
				color: #262626;
				line-height: 1.3;
			}

			.feature-meta {
				display: flex;
				align-items: center;
				gap: 8px;

				.feature-category {
					font-size: 12px;
					color: #8c8c8c;
					background: #f0f0f0;
					padding: 2px 8px;
					border-radius: 4px;
				}
			}
		}

		.feature-toggle {
			flex-shrink: 0;
		}
	}

	.feature-description {
		font-size: 13px;
		color: #595959;
		line-height: 1.5;
		margin-bottom: 12px;
	}

	.feature-sub-features {
		margin-bottom: 12px;

		.sub-features-title {
			font-size: 12px;
			font-weight: 500;
			color: #262626;
			margin-bottom: 8px;
		}

		.sub-features-list {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
	}

	.feature-usage {
		margin-bottom: 12px;

		.usage-title {
			font-size: 12px;
			font-weight: 500;
			color: #262626;
			margin-bottom: 6px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			cursor: pointer;
			user-select: none;
			padding: 4px 0;
			transition: color 0.2s ease;

			&:hover {
				color: #1890ff;
			}

			.usage-toggle-icon {
				transition: transform 0.2s ease;
				color: #8c8c8c;

				&.expanded {
					transform: rotate(180deg);
				}
			}
		}

		.usage-content {
			max-height: 0;
			overflow: hidden;
			transition: max-height 0.3s ease;

			&.expanded {
				max-height: 200px;
			}

			.usage-list {
				margin: 0;
				padding-left: 16px;
				list-style: none;

				li {
					font-size: 12px;
					color: #595959;
					line-height: 1.4;
					margin-bottom: 4px;
					position: relative;

					&:before {
						content: '•';
						color: #1890ff;
						font-weight: bold;
						position: absolute;
						left: -12px;
					}
				}
			}
		}
	}
}
</style>
