<template>
	<n-form
		ref="formRef"
		:model="formParams"
		:rules="rules"
		label-placement="left"
		label-width="auto"
		@keydown.enter="handleSubmit"
	>
		<div class="form-row">
			<n-form-item label="任务ID" path="taskId" required>
				<n-input
					v-model:value="formParams.taskId"
					placeholder="请输入任务ID"
					clearable
				/>
			</n-form-item>

			<n-form-item label="执行ID" path="executeId" required>
				<n-input
					v-model:value="formParams.executeId"
					placeholder="请输入执行ID"
					clearable
				/>
			</n-form-item>
		</div>

		<div class="form-row">
			<n-form-item label="接口token" path="xAuthValue" required>
				<n-input
					v-model:value="formParams.xAuthValue"
					placeholder="请输入X-Auth-Value"
					clearable
				/>
			</n-form-item>

			<n-form-item label="工号" path="employeeId" required>
				<n-input
					v-model:value="formParams.employeeId"
					placeholder="请输入工号"
					clearable
				/>
			</n-form-item>
		</div>

		<div class="form-row">
			<n-form-item label="返回行数" path="rows">
				<n-input-number v-model:value="formParams.rows" :min="1" />
			</n-form-item>

			<n-form-item label="测试用例名称" path="testCaseName">
				<n-input
					v-model:value="formParams.testCaseName"
					placeholder="请输入测试用例名称"
					clearable
				/>
			</n-form-item>
		</div>

		<div class="form-row">
			<n-form-item label="确认状态" path="confirm">
				<n-select
					v-model:value="formParams.confirm"
					:options="[
						{ label: '已确认', value: '已确认' },
						{ label: '待确认', value: '待确认' },
					]"
					placeholder="请选择确认状态"
					clearable
				/>
			</n-form-item>

			<n-form-item>
				<div class="button-container">
					<n-button type="primary" @click="handleSubmit">获取数据</n-button>
				</div>
			</n-form-item>
		</div>
	</n-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storage } from 'wxt/storage'
import {
	NForm,
	NFormItem,
	NInput,
	NInputNumber,
	NButton,
	NSelect,
	FormInst,
	FormRules,
} from 'naive-ui'

const emit = defineEmits(['submit'])

const formRef = ref<FormInst | null>(null)

const formParams = ref({
	taskId: '3004',
	executeId: '242',
	xAuthValue: '992e7e22464818e086b6957c2d876a0a',
	employeeId: '0668001277',
	rows: 2000,
	testCaseName: '',
	confirm: '',
})

// 表单校验规则
const rules: FormRules = {
	taskId: [
		{
			required: true,
			message: '请输入任务ID',
			trigger: 'blur',
		},
	],
	executeId: [
		{
			required: true,
			message: '请输入执行ID',
			trigger: 'blur',
		},
	],
	xAuthValue: [
		{
			required: true,
			message: '请输入接口token',
			trigger: 'blur',
		},
	],
	employeeId: [
		{
			required: true,
			message: '请输入工号',
			trigger: 'blur',
		},
	],
}

const handleSubmit = () => {
	formRef.value?.validate((errors) => {
		if (!errors) {
			emit('submit', formParams.value)
		}
	})
}

interface StorageData {
	data?: {
		taskId?: string
		executeId?: string
		xAuthValue?: string
		employeeId?: string
		rows?: number
		testCaseName?: string
		confirm?: string
	}
}

onMounted(() => {
	storage.getItem<StorageData>('local:dtTestCenterData').then((res) => {
		console.log('🚀 ~ storage.getItem ~ res:', res)
		if (res?.data) {
			formParams.value = {
				...formParams.value,
				...res.data,
			}
		}
	})
})
</script>

<style scoped lang="less">
.button-container {
	display: flex;
	justify-content: flex-end;
	width: 100%;
}

.n-form {
	width: 100%;
	.n-input-number {
		width: 100%;
	}
	.form-row {
		display: flex;
		gap: 16px;
		.n-form-item {
			flex: 1;
		}
	}
}
</style>
