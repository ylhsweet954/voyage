<template>
	<div class="popup-container">
		<popup-header />
		<div class="tabs-container">
			<n-tabs
				v-model:value="activeTab"
				type="segment"
				animated
				size="small"
				justify-content="space-evenly"
			>
				<n-tab-pane
					v-for="tab in tabs"
					:key="tab.name"
					:name="tab.name"
					:tab="tab.label"
				>
					<div class="tab-content">
						<component :is="activeComponent" />
					</div>
				</n-tab-pane>
			</n-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import PopupHeader from '../components/popup-header.vue'
import AISetting from '../panes/ai-setting.vue'
import FeatureSetting from '../panes/feature-setting.vue'
import CacheSetting from '../panes/cache-setting.vue'
import OtherSetting from '../panes/other-setting.vue'

const tabs = [
	{ label: '功能配置', name: 'tab-a', component: FeatureSetting },
	{ label: 'AI-Setting', name: 'tab-b', component: AISetting },
	{ label: '缓存', name: 'tab-c', component: CacheSetting },
	{ label: '其他', name: 'tab-d', component: OtherSetting },
]

const activeTab = ref(tabs[0].name)

const activeComponent = computed(() => {
	return tabs.find((tab) => tab.name === activeTab.value)?.component
})
</script>

<style lang="less" scoped>
.tabs-container {
	padding: 16px;
}

.tab-content {
	max-height: 430px;
	overflow-y: auto;
	padding: 0 6px;

	// 美化滚动条
	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	&::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;

		&:hover {
			background: #a1a1a1;
		}
	}
}
</style>
