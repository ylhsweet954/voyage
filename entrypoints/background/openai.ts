import OpenAI from 'openai'
import { AIConfig } from '../types'

export async function requestOpenAI(config: AIConfig, prompt: string) {
	const openai = new OpenAI({
		baseURL: config.baseUrl,
		apiKey: config.apiKey,
	})

	const completion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: prompt }],
		model: config.model,
	})

	return completion.choices[0].message.content
}
