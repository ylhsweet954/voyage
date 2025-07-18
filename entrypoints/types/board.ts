interface BoardCommonFields {
	HasRiskHappened?: boolean // 有无风险
	PlanFinishDate: string // 计划完成日期
	RemainingWork?: number // 剩余工作
	// System_Id: string; // RDC标识
	System_Title: string // 标题
	CompletedWork?: number // 已完成工作
	TaskPhase?: string // 任务阶段
	cardColor?: string // 卡片颜色，"F56664"表示已超期，"FFC8C4"表示即将超期
}

export interface BoardResult extends BoardCommonFields {
	System_AppointedTo: string // 指派给（已解析）
	System_TaskState: string // 任务状态
	System_WorkItemType: string // 工作项类型（已解析）
	TaskState: string // 任务状态（已超期、即将超期、正常）
	// 语义化属性
	isOverdue: boolean // 是否已超期
	isNearlyOverdue: boolean // 是否即将超期
	isProgressLagging: boolean // 是否进度滞后
	workingDaysToFinish: number // 工作日数到完成时间
	remainingWorkDays: number // 剩余工作需要的工作日数
}

export interface BoardData extends BoardCommonFields {
	System_AppointedTo: {
		nameDisplayLong: string
	}
	System_Column: string // 列名（任务状态）
	System_WorkItemType: {
		name: string
	}
}
