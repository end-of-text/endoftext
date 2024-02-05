import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { LLM } from './llm';

export class OpenAILLM extends LLM {
	openai: OpenAI;
	model = 'gpt-3.5-turbo-1106';

	constructor(apiKey: string) {
		super();
		this.openai = new OpenAI({ apiKey: apiKey });
	}

	async generate(
		messages: ChatCompletionMessageParam[],
		json: boolean = false
	): Promise<string | null> {
		const completion = await this.openai.chat.completions.create({
			messages: messages,
			model: 'gpt-3.5-turbo-1106',
			...(json ? { response_format: { type: 'json_object' } } : {})
		});
		try {
			return completion.choices[0].message.content;
		} catch (e) {
			throw new Error('Could not generate completion');
		}
	}
}
