<template>
	<n-modal
		v-model:show="visible"
		:mask-closable="false"
		:close-on-esc="false"
		:auto-focus="false"
		:trap-focus="false"
		transform-origin="center"
		:style="modalStyle"
	>
		<div
			ref="modalRef"
			class="draggable-modal"
			:style="modalContentStyle"
			@mousedown="handleMouseDown"
		>
			<!-- 标题栏 -->
			<div
				ref="headerRef"
				class="modal-header"
				@mousedown="startDrag"
			>
				<div class="modal-title">
					<slot name="title">{{ title }}</slot>
				</div>
				<div class="modal-actions">
					<n-button
						text
						size="small"
						@click="closeModal"
					>
						<n-icon size="16">
							<CloseOutlined />
						</n-icon>
					</n-button>
				</div>
			</div>

			<!-- 内容区域 -->
			<div class="modal-body">
				<slot>
					<div class="default-content">
						<p>这是一个可拖拽和调节大小的弹窗</p>
						<p>您可以：</p>
						<ul>
							<li>拖拽标题栏移动弹窗</li>
							<li>拖拽右下角调节大小</li>
							<li>点击关闭按钮关闭弹窗</li>
						</ul>
					</div>
				</slot>
			</div>

			<!-- 调节大小的拖拽手柄 -->
			<div
				class="resize-handle"
				@mousedown="startResize"
			></div>
		</div>
	</n-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'

interface Props {
	show?: boolean
	title?: string
	width?: number
	height?: number
	x?: number
	y?: number
	minWidth?: number
	minHeight?: number
	maxWidth?: number
	maxHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
	show: false,
	title: '弹窗',
	width: 600,
	height: 400,
	x: 0,
	y: 0,
	minWidth: 300,
	minHeight: 200,
	maxWidth: 1200,
	maxHeight: 800,
})

const emit = defineEmits<{
	'update:show': [value: boolean]
	'update:width': [value: number]
	'update:height': [value: number]
	'update:x': [value: number]
	'update:y': [value: number]
}>()

const modalRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()

// 弹窗状态
const visible = ref(props.show)
const modalWidth = ref(props.width)
const modalHeight = ref(props.height)
const modalX = ref(props.x)
const modalY = ref(props.y)

// 拖拽状态
const isDragging = ref(false)
const isResizing = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragStartModalX = ref(0)
const dragStartModalY = ref(0)

// 调节大小状态
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)

// 监听 props 变化
watch(() => props.show, (newVal) => {
	visible.value = newVal
	if (newVal) {
		nextTick(() => {
			centerModal()
		})
	}
})

watch(visible, (newVal) => {
	emit('update:show', newVal)
})

// 计算样式
const modalStyle = computed(() => ({
	position: 'fixed',
	top: '0',
	left: '0',
	width: '100vw',
	height: '100vh',
	zIndex: 9999,
}))

const modalContentStyle = computed(() => ({
	position: 'absolute',
	left: `${modalX.value}px`,
	top: `${modalY.value}px`,
	width: `${modalWidth.value}px`,
	height: `${modalHeight.value}px`,
	minWidth: `${props.minWidth}px`,
	minHeight: `${props.minHeight}px`,
	maxWidth: `${props.maxWidth}px`,
	maxHeight: `${props.maxHeight}px`,
}))

// 居中弹窗
const centerModal = () => {
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight
	modalX.value = (windowWidth - modalWidth.value) / 2
	modalY.value = (windowHeight - modalHeight.value) / 2
}

// 开始拖拽
const startDrag = (e: MouseEvent) => {
	if (isResizing.value) return
	
	isDragging.value = true
	dragStartX.value = e.clientX
	dragStartY.value = e.clientY
	dragStartModalX.value = modalX.value
	dragStartModalY.value = modalY.value

	document.addEventListener('mousemove', handleDrag)
	document.addEventListener('mouseup', stopDrag)
	e.preventDefault()
}

// 拖拽中
const handleDrag = (e: MouseEvent) => {
	if (!isDragging.value) return

	const deltaX = e.clientX - dragStartX.value
	const deltaY = e.clientY - dragStartY.value

	modalX.value = Math.max(0, Math.min(
		window.innerWidth - modalWidth.value,
		dragStartModalX.value + deltaX
	))
	modalY.value = Math.max(0, Math.min(
		window.innerHeight - modalHeight.value,
		dragStartModalY.value + deltaY
	))
}

// 停止拖拽
const stopDrag = () => {
	isDragging.value = false
	document.removeEventListener('mousemove', handleDrag)
	document.removeEventListener('mouseup', stopDrag)
	emit('update:x', modalX.value)
	emit('update:y', modalY.value)
}

// 开始调节大小
const startResize = (e: MouseEvent) => {
	isResizing.value = true
	resizeStartX.value = e.clientX
	resizeStartY.value = e.clientY
	resizeStartWidth.value = modalWidth.value
	resizeStartHeight.value = modalHeight.value

	document.addEventListener('mousemove', handleResize)
	document.addEventListener('mouseup', stopResize)
	e.preventDefault()
	e.stopPropagation()
}

// 调节大小中
const handleResize = (e: MouseEvent) => {
	if (!isResizing.value) return

	const deltaX = e.clientX - resizeStartX.value
	const deltaY = e.clientY - resizeStartY.value

	const newWidth = Math.max(props.minWidth, Math.min(
		props.maxWidth,
		resizeStartWidth.value + deltaX
	))
	const newHeight = Math.max(props.minHeight, Math.min(
		props.maxHeight,
		resizeStartHeight.value + deltaY
	))

	modalWidth.value = newWidth
	modalHeight.value = newHeight

	// 确保弹窗不会超出屏幕
	modalX.value = Math.min(modalX.value, window.innerWidth - newWidth)
	modalY.value = Math.min(modalY.value, window.innerHeight - newHeight)
}

// 停止调节大小
const stopResize = () => {
	isResizing.value = false
	document.removeEventListener('mousemove', handleResize)
	document.removeEventListener('mouseup', stopResize)
	emit('update:width', modalWidth.value)
	emit('update:height', modalHeight.value)
}

// 处理鼠标按下事件（防止事件冒泡）
const handleMouseDown = (e: MouseEvent) => {
	e.stopPropagation()
}

// 关闭弹窗
const closeModal = () => {
	visible.value = false
}
</script>

<style lang="less" scoped>
.draggable-modal {
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	user-select: none;

	.modal-header {
		background: #f5f5f5;
		border-bottom: 1px solid #e8e8e8;
		padding: 12px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: move;
		min-height: 48px;

		.modal-title {
			font-weight: 500;
			font-size: 16px;
			color: #333;
		}

		.modal-actions {
			display: flex;
			align-items: center;
		}
	}

	.modal-body {
		flex: 1;
		padding: 16px;
		overflow: auto;

		.default-content {
			p {
				margin: 0 0 12px 0;
			}

			ul {
				margin: 0;
				padding-left: 20px;

				li {
					margin-bottom: 8px;
				}
			}
		}
	}

	.resize-handle {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 16px;
		height: 16px;
		cursor: se-resize;
		background: linear-gradient(
			-45deg,
			transparent 0%,
			transparent 40%,
			#ccc 40%,
			#ccc 60%,
			transparent 60%,
			transparent 100%
		);

		&:hover {
			background: linear-gradient(
				-45deg,
				transparent 0%,
				transparent 40%,
				#999 40%,
				#999 60%,
				transparent 60%,
				transparent 100%
			);
		}
	}
}
</style>
