import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export class OpenAIWrapper {
	openai: OpenAI;
	model = 'gpt-3.5-turbo-1106';

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey: apiKey });
	}

	async generate(messages: ChatCompletionMessageParam[]) {
		console.log(messages);
		const completion = await this.openai.chat.completions.create({
			messages: messages,
			model: 'gpt-3.5-turbo-1106'
		});
		try {
			console.log(completion);
			return completion.choices[0].message.content;
		} catch (e) {
			console.error(e);
		}
	}
}

export const openai = new OpenAIWrapper(OPENAI_API_KEY);
