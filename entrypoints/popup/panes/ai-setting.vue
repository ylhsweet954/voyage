<template>
	<div class="ai-settings">
		<div class="settings-card">
			<div class="card-header">
				<div class="header-icon">🤖</div>
				<div class="header-title">
					<h3>AI 配置</h3>
					<span class="header-desc">配置您的AI服务连接信息</span>
				</div>
			</div>

			<n-form
				ref="formRef"
				:model="form"
				label-placement="left"
				label-width="80px"
				@submit.prevent="handleSubmit"
			>
				<n-form-item
					label="API 地址"
					path="baseUrl"
					:validation-status="errors.baseUrl ? 'error' : undefined"
					:feedback="errors.baseUrl"
				>
					<n-input
						v-model:value="form.baseUrl"
						placeholder="请输入 API 地址"
						size="small"
						@blur="validateField('baseUrl')"
					/>
				</n-form-item>

				<n-form-item
					label="API Key"
					path="apiKey"
					:validation-status="errors.apiKey ? 'error' : undefined"
					:feedback="errors.apiKey"
				>
					<n-input
						v-model:value="form.apiKey"
						placeholder="请输入 API Key"
						type="password"
						size="small"
						show-password-on="click"
						@blur="validateField('apiKey')"
					/>
				</n-form-item>

				<n-form-item
					label="模型"
					path="model"
					:validation-status="errors.model ? 'error' : undefined"
					:feedback="errors.model"
				>
					<n-select
						v-model:value="form.model"
						placeholder="请选择模型"
						size="small"
						:options="modelOptions"
						@update:value="validateField('model')"
					/>
				</n-form-item>

				<n-form-item label="测试提示词">
					<n-input
						v-model:value="testPrompt"
						type="textarea"
						placeholder="请输入测试提示词..."
						:rows="3"
						:maxlength="1000"
						size="small"
						show-count
					/>
				</n-form-item>

				<div class="action-buttons">
					<n-button type="primary" size="small" @click="handleSubmit">
						保存配置
					</n-button>
					<n-button size="small" @click="handleReset">重置</n-button>
					<n-button
						size="small"
						:loading="isCheckingConnection"
						:disabled="!testPrompt.trim()"
						@click="handleCheck"
					>
						测试连接
					</n-button>
				</div>
			</n-form>
		</div>

		<!-- AI回复显示区域 -->
		<div v-if="aiResponse" class="response-card">
			<div class="response-header">
				<div class="response-icon">💬</div>
				<span class="response-title">AI 回复</span>
			</div>
			<div class="response-content">{{ aiResponse }}</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { storage } from 'wxt/storage'
import { AIConfig } from '@/entrypoints/types'
import { aiConfig } from '@/entrypoints/common/config'

const message = useMessage()

const formRef = ref<FormInst | null>(null)
const modelOptions = [
	{
		label: 'deepseek-chat',
		value: 'deepseek-chat',
	},
	{
		label: 'deepseek-R1',
		value: 'deepseek-R1',
	},
]

const form = ref(aiConfig)

const errors = ref({
	baseUrl: '',
	apiKey: '',
	model: '',
})

const isCheckingConnection = ref(false)
const testPrompt = ref('你好')
const aiResponse = ref('')

const validateField = (field: keyof typeof form.value) => {
	const value = form.value[field]

	if (!value) {
		let message = ''
		switch (field) {
			case 'baseUrl':
				message = '请输入 API 地址'
				break
			case 'apiKey':
				message = '请输入 API Key'
				break
			case 'model':
				message = '请选择模型'
				break
		}
		errors.value[field] = message
		return false
	}

	errors.value[field] = ''
	return true
}

const validateForm = () => {
	let isValid = true
	isValid = validateField('baseUrl') && isValid
	isValid = validateField('apiKey') && isValid
	isValid = validateField('model') && isValid
	return isValid
}

// 初始化表单数据
const initFormData = async () => {
	const config = (await storage.getItem('local:AIConfig')) as AIConfig
	if (config) {
		form.value = { ...form.value, ...config }
	} else {
		form.value = aiConfig
	}
}

const handleReset = () => {
	form.value = {
		baseUrl: 'https://api.deepseek.com',
		apiKey: '',
		model: 'deepseek-chat',
	}
	errors.value = {
		baseUrl: '',
		apiKey: '',
		model: '',
	}
	testPrompt.value = '你好'
	aiResponse.value = ''
}

const handleSubmit = async () => {
	if (validateForm()) {
		await storage.setItem('local:AIConfig', form.value)
	}
}

const handleCheck = async () => {
	if (validateForm()) {
		if (!testPrompt.value.trim()) {
			message.warning('请输入测试提示词')
			return
		}

		isCheckingConnection.value = true
		aiResponse.value = ''

		try {
			const response = await browser.runtime.sendMessage({
				type: 'requestOpenAI',
				config: form.value,
				prompt: testPrompt.value,
			})
			if (response.success) {
				message.success('测试连接成功')
				aiResponse.value = response.data
				console.log('🚀 ~ handleCheck:', response.data)
			} else {
				message.error(response.error || '测试连接失败')
			}
		} finally {
			isCheckingConnection.value = false
		}
	}
}

onMounted(() => {
	initFormData()
})
</script>

<style lang="less" scoped>
.ai-settings {
	padding: 8px 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.settings-card {
	background: #ffffff;
	border: 1px solid #f0f0f0;
	border-radius: 12px;
	padding: 20px;
}

.card-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.header-icon {
	font-size: 20px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f0f2ff;
	border-radius: 6px;
}

.header-title {
	h3 {
		margin: 0 0 2px 0;
		font-size: 16px;
		font-weight: 600;
		color: #262626;
	}
}

.header-desc {
	font-size: 12px;
	color: #8c8c8c;
}

.action-buttons {
	display: flex;
	justify-content: center;
	gap: 8px;
	margin-top: 4px;
}

.response-card {
	background: #fafafa;
	border: 1px solid #f0f0f0;
	border-radius: 12px;
	padding: 16px;
}

.response-header {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
}

.response-icon {
	font-size: 16px;
}

.response-title {
	font-size: 14px;
	font-weight: 500;
	color: #262626;
}

.response-content {
	white-space: pre-wrap;
	word-wrap: break-word;
	line-height: 1.5;
	color: #595959;
	font-size: 13px;
	background: #ffffff;
	padding: 12px;
	border-radius: 8px;
	border: 1px solid #f0f0f0;
}
</style>
