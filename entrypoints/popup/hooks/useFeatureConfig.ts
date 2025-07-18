import { ref, onMounted } from 'vue'
import { storage } from 'wxt/storage'
import { Feature, SubFeature } from '@/entrypoints/types'
import { featureConfig, action } from '@/entrypoints/common/config'

export function useFeatureConfig() {
	const features = ref<Feature[]>(featureConfig)

	// 工具函数：发送消息给当前标签页
	const sendMessageToActiveTab = async (message: any) => {
		const [tab]: chrome.tabs.Tab[] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		})
		if (!tab?.id) {
			return
		}
		chrome.tabs.sendMessage(tab.id, message)
	}

	// 工具函数：保存配置到存储
	const saveConfig = async () => {
		await storage.setItem('local:featureConfig', features.value)
	}

	// 工具函数：将对象数组转换为数组（兼容旧版本数据格式）
	const ensureArray = <T>(data: T[] | Record<string, T> | undefined): T[] => {
		if (!data) return []
		if (Array.isArray(data)) return data
		return Object.values(data)
	}

	// 工具函数：标准化Feature对象
	const normalizeFeature = (feature: Feature): Feature => {
		return {
			...feature,
			usage: ensureArray(feature.usage),
			subFeatures: ensureArray(feature.subFeatures),
		}
	}

	// 工具函数：合并缓存配置和默认配置
	const mergeFeatureConfigs = (
		defaultFeatures: Feature[],
		cachedFeatures: Feature[]
	): Feature[] => {
		return defaultFeatures.map((defaultFeature) => {
			const cachedFeature = cachedFeatures.find(
				(f) => f.key === defaultFeature.key
			)

			if (!cachedFeature) {
				return { ...defaultFeature, showUsage: false }
			}

			// 合并子功能配置
			const mergedSubFeatures = defaultFeature.subFeatures?.map(
				(defaultSub) => {
					const cachedSub = cachedFeature.subFeatures?.find(
						(s) => s.key === defaultSub.key
					)
					return cachedSub ? { ...defaultSub, ...cachedSub } : defaultSub
				}
			)

			return {
				...defaultFeature,
				...cachedFeature,
				showUsage: cachedFeature.showUsage || false,
				subFeatures: mergedSubFeatures || defaultFeature.subFeatures,
			}
		})
	}

	// 功能开关变更处理
	const onChange = async (val: boolean, feature: Feature) => {
		const targetFeature = features.value.find((f) => f.key === feature.key)
		if (targetFeature) {
			targetFeature.enabled = val
		}

		await saveConfig()
		await sendMessageToActiveTab({
			action: action.feature_toggle,
			feature: feature.key,
			visible: val,
		})
	}

	// 子功能开关变更处理
	const onSubFeatureChange = async (val: boolean, subFeature: SubFeature) => {
		for (const feature of features.value) {
			if (feature.subFeatures) {
				const targetSubFeature = feature.subFeatures.find(
					(sf) => sf.key === subFeature.key
				)
				if (targetSubFeature) {
					targetSubFeature.enabled = val
					break
				}
			}
		}

		await saveConfig()
		await sendMessageToActiveTab({
			action: action.feature_toggle,
			feature: subFeature.key,
			visible: val,
		})
	}

	// 切换使用说明显示状态
	const toggleUsage = (index: number) => {
		features.value[index].showUsage = !features.value[index].showUsage
	}

	// 初始化表单数据
	const initFormData = async () => {
		const cacheFeatureConfig = (await storage.getItem(
			'local:featureConfig'
		)) as Feature[] | Record<string, Feature> | null

		if (!cacheFeatureConfig) {
			// 没有缓存配置，使用默认配置
			features.value = featureConfig.map((feature) => ({
				...feature,
				showUsage: false,
			}))
			return
		}

		// 标准化缓存配置数据格式
		const normalizedCacheConfig =
			ensureArray(cacheFeatureConfig).map(normalizeFeature)

		// 合并缓存配置和默认配置
		features.value = mergeFeatureConfigs(featureConfig, normalizedCacheConfig)
	}

	// 自动初始化
	onMounted(() => {
		initFormData()
	})

	return {
		features,
		onChange,
		onSubFeatureChange,
		toggleUsage,
		initFormData,
	}
}
