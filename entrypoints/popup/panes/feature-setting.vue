<template>
	<div class="feature-settings">
		<div class="features-grid">
			<FeatureCard
				v-for="(feature, index) in features"
				:key="index"
				:feature="feature"
				@change="onChange"
				@sub-feature-change="onSubFeatureChange"
				@toggle-usage="() => toggleUsage(index)"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import FeatureCard from '../components/feature-card.vue'
import { useFeatureConfig } from '../hooks/useFeatureConfig'

const { features, onChange, onSubFeatureChange, toggleUsage } =
	useFeatureConfig()
</script>

<style lang="less" scoped>
.feature-settings {
	padding: 8px 0;

	.features-grid {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
}
</style>
