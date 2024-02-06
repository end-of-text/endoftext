import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export type LLMOptions = {
	model?: string;
	temperature?: number;
	json?: boolean;
};

export abstract class LLM {
	abstract generate(
		messages: ChatCompletionMessageParam[],
		options?: LLMOptions
	): Promise<string | null>;
}
