<template>
	<div
		class="floating-tools"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<div class="toggle-button" @click="visible = !visible">
			<FullscreenOutlined v-if="!visible" />
			<FullscreenExitOutlined v-else />
		</div>
		<button-group
			v-show="visible"
			:modal-state="showModalRef"
			@input-focus="handleInputFocus"
			@input-blur="handleInputBlur"
			@modal-toggle="handleModalToggle"
		/>
	</div>

	<DraggableModal
		v-model:show="showModal"
		title="LCAP 工具弹窗"
		:width="800"
		:height="500"
	>
		<lcap-info />
	</DraggableModal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import ButtonGroup from './components/button-group.vue'
import LcapInfo from './components/lcap-info.vue'
import DraggableModal from '@/components/draggable-modal.vue'
import {
	FullscreenOutlined,
	FullscreenExitOutlined,
} from '@ant-design/icons-vue'

const visible = ref(false)
const inputFocused = ref(false)
const mouseInside = ref(false)
const showModal = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null

// 创建一个计算属性来传递给子组件
const showModalRef = computed(() => showModal)

const handleMouseEnter = () => {
	mouseInside.value = true
	// 清除之前的定时器（如果存在）
	if (showTimer) {
		clearTimeout(showTimer)
	}
	// 设置300ms延迟显示
	showTimer = setTimeout(() => {
		visible.value = true
		showTimer = null
	}, 200)
}

const handleMouseLeave = () => {
	mouseInside.value = false
	// 清除定时器，防止延迟显示
	if (showTimer) {
		clearTimeout(showTimer)
		showTimer = null
	}
	// 当输入框聚焦时，不自动隐藏工具面板
	if (!inputFocused.value) {
		visible.value = false
	}
}

const handleInputFocus = () => {
	inputFocused.value = true
}

const handleInputBlur = () => {
	inputFocused.value = false
	// 输入框失焦后，如果鼠标不在悬浮框内，立即隐藏
	if (!mouseInside.value) {
		visible.value = false
	}
}

const handleModalToggle = (show: boolean) => {
	showModal.value = show
}
</script>

<style scoped lang="less">
.floating-tools {
	display: flex;
	align-items: center;
	position: fixed;
	top: 48px;
	right: 0;
	z-index: 99999;

	.toggle-button {
		padding: 4px;
		cursor:
			url('/components/pointer.png') 14 0,
			pointer;
		transition: all 0.3s;
		background-color: white;
		border-radius: 4px;
		box-shadow:
			0.2rem 0.2rem 0.4rem #fff,
			-0.2rem -0.2rem 0.4rem #575a63;

		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		opacity: 0.5;
		font-size: 20px;
		&:hover {
			color: #409eff;
		}
		.icon {
			width: 24px;
			height: 24px;
			fill: currentColor;
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
