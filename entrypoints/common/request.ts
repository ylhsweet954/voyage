import { ofetch } from 'ofetch'

/**
 * 获取LCAP测试数据
 *
 * @param options 获取LCAP测试数据的选项
 * @param options.testCaseName 测试用例名称，默认为空字符串
 * @param options.taskId 任务ID，默认为"3004"
 * @param options.executeId 执行ID，默认为"242"
 * @param options.rows 返回数据的行数，默认为10
 * @param options.xAuthValue 请求头中的X-Auth-Value，默认为"91bf50d0b79451bf3ddc428a4e09ccc1"
 * @returns 返回获取到的LCAP测试数据
 * @throws 若请求失败，则抛出错误
 */
export async function getLCAPTestData({
	testCaseName = '',
	taskId = '3004',
	executeId = '242',
	rows = 10,
	xAuthValue = '992e7e22464818e086b6957c2d876a0a',
	confirm = '',
	employeeId = '',
}) {
	try {
		const response = await ofetch(
			'https://dttestcenter.zte.com.cn/intelligentApi/executeResult/getPage',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Auth-Value': xAuthValue,
					'X-Emp-No': employeeId,
				},
				timeout: 5000,
				body: JSON.stringify({
					bo: {
						taskId,
						testCaseName,
						testResult: 'FAIL',
						manualMarkSubType: '',
						microserviceId: '',
						interfaceId: '',
						testSuiteName: '',
						executeId,
						confirm,
						tags: [],
						productModel: 'XYLCAP PRO300',
						executeResultIds: null,
					},
					page: 1,
					rows,
				}),
			}
		)
		return response
	} catch (error: unknown) {
		console.error('failed:', error)
		message.error(error instanceof Error ? error.message : '操作失败')
		throw new Error(error instanceof Error ? error.message : '操作失败')
	}
}
