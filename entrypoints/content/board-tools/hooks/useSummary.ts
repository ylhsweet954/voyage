import { AIConfig } from '@/entrypoints/types'
import { BoardData, BoardResult } from '@/entrypoints/types/board'
import promptTemplate from './prompt.md?raw'

export function useSummary() {
	const showSummary = ref(false)
	const loading = ref(false)
	const hasFailed = ref(false)
	const boardResults = ref<BoardResult[]>([])
	const summaryMd = ref('')
	const cachedBoardData = ref<BoardResult[]>([])

	/** 计算工作日数（排除周末） */
	function calculateWorkingDays(startDate: Date, endDate: Date): number {
		const start = new Date(startDate)
		const end = new Date(endDate)
		let workingDays = 0

		// 确保start <= end
		if (start > end) {
			return 0
		}

		const currentDate = new Date(start)
		while (currentDate <= end) {
			// 获取星期几 (0=周日, 1=周一, ..., 6=周六)
			const dayOfWeek = currentDate.getDay()
			// 排除周末 (0=周日, 6=周六)
			if (dayOfWeek !== 0 && dayOfWeek !== 6) {
				workingDays++
			}
			currentDate.setDate(currentDate.getDate() + 1)
		}

		return workingDays
	}

	/** 请求AI */
	async function requestAI(data: BoardResult[]) {
		const startTime = Date.now()
		try {
			loading.value = true
			hasFailed.value = false

			// 将数据替换到模板中
			const prompt = promptTemplate.replace(
				'%taskData%',
				JSON.stringify(data, null, 2)
			)
			console.log('🚀 ~ 晨会看板数据与提示词:', data, prompt)

			const config = (await storage.getItem('local:AIConfig')) as AIConfig

			let response = null
			if (config.apiKey) {
				response = await browser.runtime.sendMessage({
					type: 'requestOpenAI',
					config,
					prompt,
				})
			} else {
				response = await browser.runtime.sendMessage({
					type: 'requestZteAI',
					url: window.location.href,
					text: JSON.stringify(data),
				})
			}
			console.log('🚀 ~ 晨会AI总结', response)
			if (response.success) {
				summaryMd.value = response.data
				hasFailed.value = false
				// message.success('AI总结完成')
			} else {
				hasFailed.value = true
				message.error('请求失败，请检查插件内AI配置')
			}
		} catch (err) {
			hasFailed.value = true
			message.error(
				err instanceof Error ? err.message : String(err) || '请求时发生错误'
			)
		} finally {
			const endTime = Date.now()
			const duration = ((endTime - startTime) / 1000).toFixed(2)
			console.log(`🚀 ~ AI请求耗时: ${duration}秒`)
			// message.info(`请求完成，耗时 ${duration} 秒`)
			loading.value = false
		}
	}

	/** 重试功能 */
	async function retry() {
		if (cachedBoardData.value.length > 0) {
			await requestAI(cachedBoardData.value)
		}
	}

	async function handleBoardResults(results: Record<string, unknown>) {
		const currentDate = new Date()
		currentDate.setHours(0, 0, 0, 0) // 设置为今天零点

		boardResults.value = (Object.values(results).flat() as BoardData[])
			?.map((item) => {
				const planFinishDate = new Date(item.PlanFinishDate)
				const nextDay = new Date(planFinishDate)
				nextDay.setDate(nextDay.getDate() + 1)
				nextDay.setHours(0, 0, 0, 0)

				// 计算当前时间到计划完成时间的工作日数
				const workingDaysToFinish = calculateWorkingDays(currentDate, nextDay)

				// 计算剩余工作需要的工作日数（每天8小时工作制）
				const remainingWorkDays = Math.ceil((item.RemainingWork || 0) / 8)

				// 任务状态判断
				const taskState = (() => {
					// 将颜色代码转换为中文描述
					switch (item.cardColor) {
						case 'F56664':
							return '已超期'
						case 'FFC8C4':
							return '即将超期'
						default:
							return '正常'
					}
				})()

				return {
					HasRiskHappened: item.HasRiskHappened, // 是否发生风险
					PlanFinishDate: new Date(
						planFinishDate.getTime() + 24 * 60 * 60 * 1000 - 1000
					).toLocaleString('zh-CN', {
						timeZone: 'Asia/Shanghai',
					}), // 计划完成日期(北京时间)
					RemainingWork: item.RemainingWork, // 剩余工作
					System_AppointedTo: item.System_AppointedTo.nameDisplayLong, // 指派给
					System_TaskState: item.System_Column, // 列，任务状态
					// System_Id: item.System_Id, // RDC标识
					System_Title: item.System_Title, // 标题
					System_WorkItemType: item.System_WorkItemType.name, // 工作项类型
					CompletedWork: item.CompletedWork, // 已完成工作
					TaskPhase: item.TaskPhase, // 任务阶段
					TaskState: taskState, // 卡片状态
					// 新增语义化属性
					isOverdue: taskState === '已超期', // 是否已超期
					isNearlyOverdue: taskState === '即将超期', // 是否即将超期
					isProgressLagging: workingDaysToFinish < remainingWorkDays, // 是否进度滞后
					workingDaysToFinish, // 工作日数到完成时间
					remainingWorkDays, // 剩余工作需要的工作日数
				}
			})
			?.filter(
				(item) =>
					!item.System_Title.includes('故障处理及其他事项') &&
					item.System_TaskState !== '已关闭' &&
					item.System_TaskState !== '已挂起'
			)

		if (boardResults.value.length) {
			// 缓存数据用于重试
			cachedBoardData.value = [...boardResults.value]
			await requestAI(boardResults.value)
		}
	}

	return {
		showSummary,
		loading,
		hasFailed,
		boardResults,
		summaryMd,
		requestAI,
		retry,
		handleBoardResults,
	}
}
