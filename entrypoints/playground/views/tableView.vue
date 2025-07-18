<template>
	<div class="container">
		<button @click="fetchData">获取测试数据</button>

		<div v-if="loading">加载中...</div>

		<table v-if="data && !loading" class="data-table">
			<thead>
				<tr>
					<th v-for="header in tableHeaders" :key="header">{{ header }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, index) in tableData" :key="index">
					<td v-for="(value, key) in row" :key="key">{{ value }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { LCAPTestData } from '../../types/lcap-test'
import { getLCAPTestData } from '@/entrypoints/common/request'

const loading = ref(false)
const data = ref<any>(null)
const tableHeaders = ref<string[]>([])
const tableData = ref<any[]>([])

async function fetchData() {
	try {
		loading.value = true
		const response = await getLCAPTestData({ rows: 5 })
		data.value = response.bo.rows.map((item: LCAPTestData) => {
			const match = item.testCaseName.match(/【([^【】]*?)】/)

			let author = ''
			if (match && match[1]) {
				author = match[1].replace(/^作者-/, '')
			}
			return {
				testCaseName: item.testCaseName,
				author,
				failType: item.manualMarkType
					? `${item.manualMarkType}-${item.manualMarkSubType}`
					: '',
				failReson: item.failReason,
				isConfirm: item.confirm,
				comment: item.comment,
			}
		})
		console.log(
			'🚀 ~ data.value=response.bo.rows.map ~ data.value:',
			data.value
		)

		// 处理数据为表格格式
		if (data.value && Array.isArray(data.value)) {
			if (data.value.length > 0) {
				tableHeaders.value = Object.keys(data.value[0])
				tableData.value = data.value
			}
		}
	} catch (error) {
		console.error('获取数据失败:', error)
	} finally {
		loading.value = false
	}
}
</script>

<style>
.container {
	padding: 20px;
}

button {
	padding: 8px 16px;
	background: #4caf50;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover {
	background: #45a049;
}

.data-table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 20px;
}

.data-table th,
.data-table td {
	border: 1px solid #ddd;
	padding: 8px;
	text-align: left;
}

.data-table th {
	background-color: #f2f2f2;
}
</style>
