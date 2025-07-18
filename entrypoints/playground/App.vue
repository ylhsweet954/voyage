<template>
	<div class="container">
		<n-space vertical>
			<n-collapse default-expanded-names="1">
				<n-collapse-item title="用例查询接口配置" name="1">
					<ParamsForm @submit="fetchData" />
					<n-space class="filter-space">
						<n-form-item label="根据作者筛选" label-placement="left">
							<n-select
								v-model:value="selectedAuthors"
								:options="authorOptions"
								multiple
								placeholder="请选择作者"
								clearable
								filterable
							/>
						</n-form-item>
						<n-button
							secondary
							type="info"
							:disabled="!data.length"
							@click="processChartData"
						>
							应用筛选
						</n-button>
						<n-button
							secondary
							type="info"
							:disabled="!data.length"
							@click="processCSChartData"
						>
							筛选长沙团队数据
						</n-button>
					</n-space>
				</n-collapse-item>
			</n-collapse>
		</n-space>

		<div v-if="loading">加载中...</div>

		<div v-if="data.length && !loading" class="chart-container">
			<n-alert type="info" title="温馨提示">
				点击柱状图可在页面底部表格，查看具体数据信息，数据量较大，点击后会卡顿，请耐心等待
			</n-alert>
			<VChart
				class="chart"
				:option="authorChartOption"
				autoresize
				@click="handleChartClick('author', $event)"
			/>
			<VChart
				class="chart"
				:option="teamChartOption"
				autoresize
				@click="handleChartClick('team', $event)"
			/>
			<VChart
				class="chart"
				:option="reasonChartOption"
				autoresize
				@click="handleChartClick('reason', $event)"
			/>
		</div>

		<n-data-table
			v-if="selectedData.length > 0"
			:columns="tableColumns"
			:data="selectedData"
			:bordered="true"
			:max-height="1000"
			class="data-table"
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import domainData from './domain.json'
const domain: Record<string, string> = domainData
import ParamsForm from './views/paramsForm.vue'
import { LCAPTestData, LCAPTestTableData } from '../types/lcap-test'
import { getLCAPTestData } from '@/entrypoints/common/request'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	ToolboxComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
	CanvasRenderer,
	BarChart,
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent,
	ToolboxComponent,
])

const loading = ref(false)
const data = ref<LCAPTestTableData[]>([])
const selectedAuthors = ref<string[]>([])
const authorOptions = computed(() => {
	if (!data.value) return []
	const authors = Array.from(
		new Set(data.value.map((item: LCAPTestTableData) => item.author))
	)
	return authors.map((author) => ({
		label: String(author || '未知'),
		value: String(author),
		type: undefined, // 明确设置为undefined表示不是分组选项
	}))
})
const authorChartOption = ref({})
const reasonChartOption = ref({})
const teamChartOption = ref({})
const selectedData = ref<LCAPTestTableData[]>([])
const authorCount = ref<Record<string, number>>({})
const teamCount = ref<Record<string, number>>({})
const reasonCount = ref<Record<string, number>>({})
const tableColumns = [
	{
		title: '用例名称',
		key: 'testCaseName',
		ellipsis: {
			tooltip: true,
		},
	},
	{ title: '作者', key: 'author' },
	{ title: '失败原因类型', key: 'failResonType' },
	{
		title: '失败原因',
		key: 'failReson',
		ellipsis: {
			tooltip: true,
		},
	},
	{
		title: '是否确认',
		key: 'isConfirm',
		render: (rowData: LCAPTestTableData) => {
			return rowData.isConfirm.toString()
		},
	},
	{
		title: '评论',
		key: 'comment',
		ellipsis: {
			tooltip: true,
		},
	},
]

const formParams = ref({
	testCaseName: '',
	taskId: '3004',
	executeId: '242',
	rows: 2000,
	employeeId: '',
	confirm: '',
})

function handleChartClick(type: string, event: any) {
	if (!event.dataIndex && event.dataIndex !== 0) return

	const filteredData: LCAPTestTableData[] =
		selectedAuthors.value.length > 0
			? data.value.filter((item: LCAPTestTableData) =>
					selectedAuthors.value.includes(item.author)
				)
			: data.value

	switch (type) {
		case 'author':
			const author = Object.keys(authorCount.value)[event.dataIndex]
			selectedData.value = filteredData.filter(
				(item: LCAPTestTableData) => item.author === author
			)
			break
		case 'team':
			const team = Object.keys(teamCount.value)[event.dataIndex]
			selectedData.value = filteredData.filter(
				(item: LCAPTestTableData) => domain[item.author || '未知'] === team
			)
			break
		case 'reason':
			const reason = Object.keys(reasonCount.value)[event.dataIndex]
			selectedData.value = filteredData.filter(
				(item: LCAPTestTableData) =>
					item.failResonType === reason ||
					(!item.failResonType && reason === '无失败原因')
			)
			break
	}
}

function processCSChartData() {
	selectedAuthors.value = [
		'卿敏龙',
		'莫剑飞',
		'袁龙辉',
		'谢志鸿',
		'张颖',
		'佘燕敏',
		'刘元澎',
		'王泽琛',
		'朱伟',
		'黄剑雄',
		'饶忠平',
	]
	processChartData()
}

function processChartData() {
	if (!data.value) return
	console.log('🚀 ~ selectedAuthors', selectedAuthors.value)

	// 处理数据为图表格式
	if (data.value && Array.isArray(data.value)) {
		if (data.value.length > 0) {
			// 按作者分类统计
			const filteredData =
				selectedAuthors.value.length > 0
					? data.value.filter((item: LCAPTestTableData) =>
							selectedAuthors.value.includes(item.author)
						)
					: data.value

			authorCount.value = filteredData.reduce(
				(acc, item) => {
					acc[item.author] = (acc[item.author] || 0) + 1
					return acc
				},
				{} as Record<string, number>
			)

			// 按失败原因分类统计
			reasonCount.value = filteredData.reduce(
				(acc, item) => {
					const reasonType = item.failResonType || '无失败原因'
					acc[reasonType] = (acc[reasonType] || 0) + 1
					return acc
				},
				{} as Record<string, number>
			)

			// 生成作者图表配置
			const authorTotal = Object.values(authorCount.value).reduce(
				(sum, count) => sum + count,
				0
			)
			authorChartOption.value = {
				title: {
					text: `按作者分类统计 (总计: ${authorTotal})`,
				},
				tooltip: {},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				xAxis: {
					type: 'category',
					data: Object.keys(authorCount.value),
					axisLabel: {
						rotate: 45,
						interval: 0,
						formatter: (value: string) => value || '未知',
					},
				},
				yAxis: { type: 'value' },
				series: [
					{
						type: 'bar',
						data: Object.values(authorCount.value),
						label: {
							show: true,
							position: 'top',
						},
					},
				],
			}

			// 按团队分类统计
			teamCount.value = filteredData.reduce(
				(acc, item) => {
					const team = domain[item.author || '未知'] || '未知团队'
					acc[team] = (acc[team] || 0) + 1
					return acc
				},
				{} as Record<string, number>
			)

			// 生成团队图表配置
			const teamTotal = Object.values(teamCount.value).reduce(
				(sum, count) => sum + count,
				0
			)
			teamChartOption.value = {
				title: {
					text: `按团队分类统计 (总计: ${teamTotal})`,
				},
				tooltip: {},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				xAxis: {
					type: 'category',
					data: Object.keys(teamCount.value),
					axisLabel: {
						rotate: 45,
						interval: 0,
						formatter: (value: string) => value || '未知',
					},
				},
				yAxis: { type: 'value' },
				series: [
					{
						type: 'bar',
						data: Object.values(teamCount.value),
						label: {
							show: true,
							position: 'top',
						},
					},
				],
				grid: {
					bottom: 120,
				},
			}

			// 生成失败原因图表配置
			const reasonTotal = Object.values(reasonCount.value).reduce(
				(sum, count) => sum + count,
				0
			)
			reasonChartOption.value = {
				title: {
					text: `按失败原因分类统计 (总计: ${reasonTotal})`,
				},
				tooltip: {},
				toolbox: {
					feature: {
						saveAsImage: {},
					},
				},
				xAxis: {
					type: 'category',
					data: Object.keys(reasonCount.value),
					axisLabel: {
						rotate: 45,
						interval: 0,
						formatter: (value: string) => value || '未知',
					},
				},
				yAxis: { type: 'value' },
				series: [
					{
						type: 'bar',
						data: Object.values(reasonCount.value),
						label: {
							show: true,
							position: 'top',
						},
					},
				],
				grid: {
					bottom: 200,
				},
			}
		}
	}
}

async function fetchData(params: any) {
	formParams.value = params
	try {
		loading.value = true
		const response = await getLCAPTestData(formParams.value)
		data.value = response.bo.rows.map((item: LCAPTestData) => {
			const match = item.testCaseName.match(/【作者-([^】]+)】/)

			let author = ''
			if (match && match[1]) {
				author = match[1].replace(/^作者-/, '')
			}
			return {
				testCaseName: item.testCaseName,
				author,
				failResonType: item.manualMarkType
					? `${item.manualMarkType}-${item.manualMarkSubType}`
					: '',
				failReson: item.failReason,
				isConfirm: item.confirm,
				comment: item.comment,
			}
		})
		console.log('🚀 ~ data.value:', data.value)

		processChartData()
	} catch (error) {
		message.error('获取数据失败，请检查token是否过期')
		console.error('获取数据失败:', error)
	} finally {
		loading.value = false
	}
}
</script>

<style lang="less" scoped>
:deep(.n-collapse-item__content-inner) {
	padding: 16px 24px 0;
}
:deep(.filter-space) {
	margin-top: 12px;
	> div:first-child {
		flex: 1;
	}
}
.container {
	padding: 20px;
}

.chart-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-top: 4px;
}

.chart {
	width: 100%;
	height: 350px;
}
</style>
