export interface LCAPTestData {
	taskId: number // url里的需要
	executeId: number // 构建序号
	testCaseName: string // 套件名+用例名称
	testResult: 'FAIL' | 'PASS' | 'SKIP'
	executeInfo: string // 执行详情，可看到失败原因
	testCaseExecuteDetail: string // 用例代码
	manualMarkType: string // 手动标记类型，比如：用例问题、需求变更等
	manualMarkSubType: string // 手动标记子类型，比如：用例问题、需求变更等备注
	comment: string // 备注
	confirm: boolean // 是否确认
	testSuiteName: string // 套件名
	failReason: string // 失败原因
}

export interface LCAPTestTableData {
	testCaseName: string
	author: string
	failResonType: string
	failReason: string
	isConfirm: boolean
	comment: string
}
