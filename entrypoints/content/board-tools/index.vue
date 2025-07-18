<template>
	<div v-if="isBoardPage" class="y-panel">
		<n-spin :show="isLoading">
			<!-- 操作区 -->
			<div class="y-panel__operation">
				<n-button
					type="primary"
					class="y-panel__btn--random"
					@click="randomSelect"
				>
					{{ currentRandomText }}
				</n-button>
				<n-button @click="clearSelection">清除选择</n-button>
				<n-button @click="loadData">加载数据</n-button>
				<n-button @click="resetRandomSelect">重置随机选择</n-button>
				<n-button
					v-if="isAISummaryEnabled"
					:loading="loading"
					@click="hasFailed ? retry() : (showSummary = !showSummary)"
				>
					<template v-if="hasFailed && !loading" #icon>
						<n-icon>
							<ReloadOutlined />
						</n-icon>
					</template>
					<span v-if="loading">AI总结中...</span>
					<span v-else-if="hasFailed">重试</span>
					<span v-else>AI总结</span>
				</n-button>
				<n-button text style="font-size: 24px" @click="showNames = !showNames">
					<n-icon class="y-panel__operation_icon">
						<CaretUpOutlined v-if="showNames" />
						<CaretDownOutlined v-else />
					</n-icon>
				</n-button>
			</div>

			<!-- 姓名区 -->
			<div v-if="showNames" class="y-panel__names">
				<n-button
					v-for="(name, idx) in tempNameList"
					:key="name + idx"
					:type="name === selectedName ? 'primary' : 'tertiary'"
					:secondary="name === selectedName"
					class="y-panel__name-btn"
					@click="selectPerson(name)"
				>
					<template #icon>
						<n-icon v-if="selectedIndices.includes(idx)">
							<CheckCircleOutlined />
						</n-icon>
					</template>
					{{ name }}
				</n-button>
			</div>
		</n-spin>
	</div>

	<n-drawer v-model:show="showSummary" :width="640" placement="right">
		<n-drawer-content title="AI晨会总结">
			<div v-marked="summaryMd" class="y-panel__summary"></div>
		</n-drawer-content>
	</n-drawer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
	CheckCircleOutlined,
	CaretUpOutlined,
	CaretDownOutlined,
	ReloadOutlined,
} from '@ant-design/icons-vue'
import { storage } from 'wxt/storage'
import { useBoardState } from './hooks/useBoardState'
import { useBoardDOM } from './hooks/useBoardDOM'
import { useBoardEvents } from './hooks/useBoardEvents'
import { useSummary } from './hooks/useSummary'
import { Feature, SubFeature } from '@/entrypoints/types'

// AI 总结功能开关状态
const isAISummaryEnabled = ref(false)

// 状态管理
const {
	nameList,
	tempNameList,
	selectedIndices,
	showNames,
	currentRandomText,
	isLoading,
	selectedName,
	isBoardPage,
} = useBoardState()

// DOM操作
const { loadData, selectPerson, clearSelection } = useBoardDOM(
	nameList,
	tempNameList,
	selectedName,
	currentRandomText,
	isLoading
)

// 事件处理
const { onKeydown, addObserver, randomSelect, resetRandomSelect, cleanup } =
	useBoardEvents(
		tempNameList,
		selectedIndices,
		currentRandomText,
		selectedName,
		isBoardPage,
		showNames,
		loadData,
		selectPerson,
		clearSelection
	)

const {
	showSummary,
	loading,
	hasFailed,
	summaryMd,
	retry,
	handleBoardResults,
} = useSummary()

/** 检查AI总结功能是否启用 */
async function checkAISummaryEnabled() {
	try {
		const cacheFeatureConfig = (await storage.getItem(
			'local:featureConfig'
		)) as Feature[] | Record<string, Feature>

		if (cacheFeatureConfig && typeof cacheFeatureConfig === 'object') {
			// 处理对象格式的配置
			const featuresArray = Array.isArray(cacheFeatureConfig)
				? cacheFeatureConfig
				: (Object.values(cacheFeatureConfig) as Feature[])

			const boardFeature = featuresArray.find((f) => f.key === 'board')
			if (boardFeature && boardFeature.subFeatures) {
				// 处理 subFeatures 可能是对象格式
				const subFeaturesArray = Array.isArray(boardFeature.subFeatures)
					? boardFeature.subFeatures
					: (Object.values(
							boardFeature.subFeatures as Record<string, any>
						) as SubFeature[])

				const aiSummaryFeature = subFeaturesArray.find(
					(sf) => sf.key === 'boardAISummary'
				)
				isAISummaryEnabled.value = aiSummaryFeature?.enabled || false
			}
		}
	} catch (error) {
		console.error('读取AI总结配置失败:', error)
		isAISummaryEnabled.value = false
	}
}

/** 入口：页面加载或 popstate 时触发 */
function initMain() {
	isBoardPage.value = /wim\/board/.test(location.href)
	if (!isBoardPage.value) {
		clearSelection()
		return
	}
	// 重置状态
	resetRandomSelect()
	addObserver()
	// 监听键盘右箭头
	document.addEventListener('keydown', onKeydown)
	// 检查AI总结功能是否启用
	checkAISummaryEnabled()
}

/** 生命周期函数 */
onMounted(() => {
	isLoading.value = true
	// 首次初始化
	initMain()
	// URL 变化监听
	window.addEventListener('popstate', initMain)
	// 监听接口数据
	window.addEventListener('message', async (event) => {
		if (event.data?.type === 'FROM_EXTENSION_API_DATA') {
			console.log('监听到接口数据：', event.data.data?.bo.result)

			// 只有在AI总结功能启用时才处理数据
			if (!isAISummaryEnabled.value) {
				console.log('AI总结功能未启用，跳过处理')
				return
			}

			// 检查是否有class为backlog-normal的元素包含"市场需求"
			const backlogElements = document.querySelectorAll(
				'.backlog-normal .el-button>span'
			)
			const hasMarketDemand = Array.from(backlogElements).some((element) =>
				element.textContent?.includes('用户故事')
			)

			if (hasMarketDemand) {
				handleBoardResults(event.data.data?.bo.result)
			} else {
				console.log('未找到包含"用户故事"的backlog-normal元素，跳过处理')
			}
		}
	})

	// 监听功能配置变化
	const messageListener = (request: any, sender: any, sendResponse: any) => {
		if (
			request.action === 'Feature_Toggle' &&
			request.feature === 'boardAISummary'
		) {
			isAISummaryEnabled.value = request.visible
			console.log('AI总结功能状态更新:', request.visible)
		}
	}
	chrome.runtime.onMessage.addListener(messageListener)
})

onBeforeUnmount(() => {
	cleanup()
	window.removeEventListener('popstate', initMain)
})
</script>

<style lang="less" scoped>
.y-panel {
	position: fixed;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	z-index: 2000;
	padding: 8px;
	background-color: rgba(255, 255, 255, 0.7);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	max-width: 90vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	&__operation {
		margin-bottom: 8px;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		:deep(.n-icon) {
			border: 1px solid #d9d9d9;
			border-radius: 4px;
		}
	}

	&__btn--random {
		font-size: 20px;
	}

	&__names {
		margin: 0 auto;
		flex-wrap: wrap;
		max-width: 90vw;
		display: flex;
		gap: 8px;
	}

	&__name-btn {
		width: 180px;
		max-width: 220px;
		color: #000;
		font-weight: 500;
	}
}
</style>

<style lang="less">
.y-panel__summary {
	h1,
	h2,
	h3,
	h4,
	h5 {
		color: red !important;
	}
}
</style>
