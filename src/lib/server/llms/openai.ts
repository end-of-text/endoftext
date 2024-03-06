import { OpenAI } from 'openai';
import type { BadRequestError } from 'openai/error.mjs';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { LLM, type LLMOptions } from './llm';

export class OpenAILLM extends LLM {
	openai: OpenAI;
	model: string = 'gpt-4-turbo-preview';
	temperature: number = 1;
	json: boolean = false;

	constructor(apiKey: string) {
		super();
		this.openai = new OpenAI({ apiKey: apiKey });
	}

	async generate(
		messages: ChatCompletionMessageParam[],
		options?: LLMOptions
	): Promise<string | null> {
		try {
			const completion = await this.openai.chat.completions.create({
				messages: messages,
				model: options?.model || this.model,
				temperature: options?.temperature || this.temperature,
				...(options?.json ? { response_format: { type: 'json_object' } } : {})
			});
			return completion.choices[0].message.content;
		} catch (e) {
			return (e as BadRequestError).message;
		}
	}
}
