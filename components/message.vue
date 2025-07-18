<template>
	<div class="message-container">
		<transition-group name="message-fade" tag="div">
			<div
				v-for="msg in messages"
				:key="msg.id"
				class="message"
				:class="`message-${msg.type}`"
			>
				{{ msg.content }}
			</div>
		</transition-group>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Message {
	id: number
	content: string
	type: 'success' | 'warning' | 'error' | 'info'
	duration: number
}

const messages = ref<Message[]>([])
let idCounter = 0

const addMessage = (options: {
	content: string
	type: 'success' | 'warning' | 'error' | 'info'
	duration: number
}) => {
	const id = ++idCounter
	messages.value.push({ id, ...options })

	setTimeout(() => {
		messages.value = messages.value.filter((msg) => msg.id !== id)
	}, options.duration)
}

defineExpose({
	addMessage,
})
</script>

<style lang="less" scoped>
.message-container {
	position: fixed;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9999;

	.message {
		padding: 10px 16px;
		margin-top: 10px;
		border-radius: 4px;
		color: #fff;
		font-size: 14px;
		min-width: 200px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

		&-success {
			background-color: #67c23a;
		}
		&-warning {
			background-color: #e6a23c;
		}
		&-error {
			background-color: #f56c6c;
		}
		&-info {
			background-color: #909399;
		}
	}

	.message-fade-enter-from,
	.message-fade-leave-to {
		opacity: 0;
		transform: translateY(-20px);
	}

	.message-fade-enter-active,
	.message-fade-leave-active {
		transition: all 0.3s ease;
	}
}
</style>
