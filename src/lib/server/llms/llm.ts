import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export abstract class LLM {
	abstract generate(messages: ChatCompletionMessageParam[], json?: boolean): Promise<string | null>;
}
