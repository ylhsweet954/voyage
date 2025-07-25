<template>
	<n-space vertical :size="8" class="button-group">
		<n-button
			v-for="(button, index) in buttons"
			:key="index"
			:loading="button.loading"
			:disabled="button.loading"
			:type="typeMap[button.type]"
			block
			secondary
			@click="button.handler"
		>
			<span>{{ button.label }}</span>
			<n-icon
				v-if="button.type === 'login' && !button.isDefault"
				class="delete-icon"
				title="删除缓存的账号"
				@click.stop="removeCachedEmp(button.label)"
			>
				<CloseOutlined />
			</n-icon>
			<!-- <n-icon
				v-if="button.type === 'login'"
				@click.stop="swapEmp(button.label)"
				class="swap-icon"
				size="18"
				title="直接切换账号登录"
			>
				<SwapOutlined width="24" height="24" />
			</n-icon> -->
		</n-button>
		<n-input
			v-model:value="empInput"
			placeholder="姓名+工号 or 工号"
			clearable
			@keyup.enter="handleLogin"
			@focus="$emit('input-focus')"
			@blur="$emit('input-blur')"
		/>
	</n-space>
</template>

<script lang="ts" setup>
import { Ref } from 'vue'
import { useContent } from '../hooks/useContent'
import { CloseOutlined } from '@ant-design/icons-vue'

// 定义 props
const props = defineProps<{
	modalState?: Ref<boolean>
}>()

// 定义 emit 事件
const emit = defineEmits<{
	'input-focus': []
	'input-blur': []
	'modal-toggle': [show: boolean]
}>()

const { buttons, empInput, handleLogin, removeCachedEmp } = useContent(
	emit,
	props.modalState
)

const typeMap: Record<string, 'primary' | 'default' | 'warning'> = {
	function: 'primary',
	login: 'default',
	other: 'warning',
}
</script>

<style scoped lang="less">
.button-group {
	max-width: 360px;
	min-width: 180px;
	padding: 8px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	:deep(.n-button) {
		cursor:
			url('/components/pointer.png') 14 0,
			pointer;
		.n-button__content {
			> span {
				max-width: 160px;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.delete-icon {
				margin-left: 8px;
				cursor: pointer;
				&:hover {
					color: #f5222d;
				}
			}
			.swap-icon {
				margin-left: 8px;
				cursor: pointer;
				&:hover {
					color: #1890ff;
				}
			}
		}
	}
}

.modal-content {
	h3 {
		margin: 0 0 16px 0;
		color: #333;
		font-size: 18px;
	}

	p {
		margin: 0 0 12px 0;
		color: #666;
		line-height: 1.6;
	}

	ul {
		margin: 0 0 20px 0;
		padding-left: 20px;
		color: #666;

		li {
			margin-bottom: 8px;
			line-height: 1.5;
		}
	}
}
</style>
