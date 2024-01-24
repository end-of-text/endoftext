import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export class OpenAIWrapper {
	openai: OpenAI;
	messages: ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content: `You are a data generation assistant. You always reply in JSON format with an array where each entry has a "text" key and the output value.`
		}
	];
	model = 'gpt-3.5-turbo-1106';
	response_format = { type: 'json_object' };
	dataDescription = '';

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey: apiKey });
	}

	async generate(messages: ChatCompletionMessageParam[]) {
		const completion = await this.openai.chat.completions.create({
			messages: messages,
			model: 'gpt-3.5-turbo-1106',
			response_format: { type: 'json_object' }
		});
		try {
			const entries = JSON.parse(completion.choices[0].message.content || '');
			return entries.results;
		} catch (e) {
			console.error(e);
		}
	}

	async getInitialSamples(numSamples: number, prompt: string) {
		this.dataDescription = prompt;
		this.messages = [...this.messages, { role: 'system', content: this.dataDescription }];
		return await this.generate([
			...this.messages,
			{ role: 'system', content: `You return exactly ${numSamples} results.` }
		]);
	}

	async generateFromPrompt(numSamples: number, prompt: string) {
		return await this.generate([
			...this.messages,
			{ role: 'system', content: `You return exactly ${numSamples} results.` },
			{ role: 'user', content: prompt }
		]);
	}

	async generateSimilar(numSamples: number, examples: string[]) {
		return await this.generate([
			...this.messages,
			{ role: 'system', content: `You return exactly ${numSamples} results.` },
			{
				role: 'system',
				content: `Generate content similar to these examples:\n${examples.join('\n')}`
			}
		]);
	}
}

export const openai = new OpenAIWrapper(OPENAI_API_KEY);
