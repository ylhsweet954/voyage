import { createApp } from 'vue'
import {
	create,
	NButton,
	NTabs,
	NTabPane,
	NAlert,
	NMessageProvider,
} from 'naive-ui'

import App from './App.vue'

const naive = create({
	components: [NButton, NTabs, NTabPane, NAlert, NMessageProvider],
})

const app = createApp(App)
app.use(naive)

app.mount('#app')
