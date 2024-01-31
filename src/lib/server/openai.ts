import { env } from '$env/dynamic/private';
import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export class OpenAIWrapper {
	openai: OpenAI;
	model = 'gpt-3.5-turbo-1106';

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey: apiKey });
	}

	async generate(messages: ChatCompletionMessageParam[]) {
		const completion = await this.openai.chat.completions.create({
			messages: messages,
			model: 'gpt-3.5-turbo-1106'
		});
		try {
			return completion.choices[0].message.content;
		} catch (e) {
			console.error(e);
		}
	}
}

export const openai = new OpenAIWrapper(env.OPENAI_API_KEY || '');
