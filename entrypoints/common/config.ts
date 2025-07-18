import { Feature, SubFeature } from '@/entrypoints/types'

export const featureConfig: Feature[] = [
	{
		label: 'LCAP 小助手',
		key: 'lcap',
		enabled: true,
		urlPattern:
			'(frontendcli|frontendrenderdemo|promc|promgr|agentfrontend|uac)',
		description: '专为LCAP平台开发的小工具，方便调试低代码平台的功能',
		usage: [
			'测试环境UAC一键登录，账号本地存储',
			'一键清空Cookie，方便快速切换账号验证功能',
			'快速从运行态页面跳转到设计态、应用页面',
			'快速替换url为本地调试状态，端口和各代码库配置一致',
		],
		icon: '🚀',
		category: '开发工具',
	},
	{
		label: 'RDC板-小助手',
		key: 'board',
		enabled: true,
		urlPattern:
			'^(https?:\\/\\/)?(studio\\.zte\\.com\\.cn|rdcloud\\.zte\\.com\\.cn)(\\/|$)',
		description: '专为RDC研发云平台设计的效率工具，简化RDC-板内的操作流程',
		usage: [
			'注意：该功能仅在RDC-板内有效',
			'注意：进入RDC-板后，需要切换为用户故事视图',
			'注意：进入RDC-板后，数据会自动滚动加载',
			'一键切换人员（通过点击人员、随机一位选人）',
			'键盘右方向键也可随机一位',
			'切换人员后，会自动滚动加载数据',
		],
		icon: '📋',
		category: '项目管理',
		subFeatures: [
			{
				label: 'AI晨会总结',
				key: 'boardAISummary',
				enabled: false,
				description: '基于RDC板内容自动生成AI晨会总结',
			},
		],
	},
	{
		label: 'Gerrit 小助手',
		key: 'gerritTools',
		enabled: true,
		urlPattern: '(gerrit|gitlab)',
		description: '代码评审小助手，提升代码评审效率',
		usage: [
			'注意：该功能仅在Gerrit、Gitlab内有效',
			'进入代码片段页面后，按c之后会在弹窗内显示“补全+save”按钮，点击后，会自动补充字数并保存。同时评论的内容会自动复制到剪切板',
			'进入评审界面后，点击Reply，会在弹窗内显示“一键审批通过”，点击即可一键+2、post、submit',
			'注意：如果没有填写reply内容，是会提示的~',
			'温馨提示：该工具仅为提效，还请务必认真评审代码，确保代码质量',
		],
		icon: '🔍',
		category: '代码审查',
	},
]

export const aiConfig = {
	baseUrl: 'https://api.deepseek.com',
	apiKey: '',
	model: 'deepseek-chat',
}

export const loginAccounts = [
	{
		username: '袁龙辉0668001277',
		password: '1',
	},
]

export const action = {
	feature_toggle: 'Feature_Toggle',
}
