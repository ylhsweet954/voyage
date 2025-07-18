import LcapTools from './lcap-tools/index.vue'
import BoardTools from './board-tools/index.vue'
import GerritTools from './gerrit-tools/index.vue'
import message from '@/components/message'
import { markedDirective } from '@/entrypoints/common/markedDirective'

export function useRenderContent() {
	const ComponentMap: Record<string, any> = {
		lcap: LcapTools,
		board: BoardTools,
		gerritTools: GerritTools,
	}

	function renderContentUI(ctx: any, componentId: string) {
		const ui = createIntegratedUi(ctx, {
			position: 'inline',
			anchor: 'body',
			onMount: (container) => {
				container.setAttribute('id', componentId)
				const app = createApp(ComponentMap[componentId])

				app.directive('marked', markedDirective)
				app.use(message)
				app.mount(container)
				return app
			},
			onRemove: (app) => {
				if (app) {
					app.unmount()
				}
			},
		})
		ui.mount()
	}

	return {
		ComponentMap,
		renderContentUI,
	}
}
