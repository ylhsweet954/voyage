import { createApp, App } from 'vue'
import MessageComponent from './message.vue'

type MessageType = 'success' | 'warning' | 'error' | 'info'

interface MessageOptions {
	type?: MessageType
	duration?: number
}

let messageInstance: InstanceType<typeof MessageComponent> | null = null

const initInstance = () => {
	const container = document.createElement('div')
	document.body.appendChild(container)

	const app = createApp(MessageComponent)
	const instance = app.mount(container) as InstanceType<typeof MessageComponent>

	return instance
}

const showMessage = (content: string, options: MessageOptions = {}) => {
	if (!messageInstance) {
		messageInstance = initInstance()
	}

	const { type = 'info', duration = 1500 } = options
	messageInstance.addMessage({ content, type, duration })
}

const message = {
	success: (content: string, duration?: number) =>
		showMessage(content, { type: 'success', duration }),
	warning: (content: string, duration?: number) =>
		showMessage(content, { type: 'warning', duration }),
	error: (content: string, duration?: number) =>
		showMessage(content, { type: 'error', duration }),
	info: (content: string, duration?: number) =>
		showMessage(content, { type: 'info', duration }),
}

export default {
	install(app: App) {
		app.config.globalProperties.$message = message
	},
	...message,
}
