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
		<ToolsContent
			v-show="visible"
			@input-focus="handleInputFocus"
			@input-blur="handleInputBlur"
		/>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ToolsContent from './content.vue'
import {
	FullscreenOutlined,
	FullscreenExitOutlined,
} from '@ant-design/icons-vue'

const visible = ref(false)
const inputFocused = ref(false)
const mouseInside = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null

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
</style>
