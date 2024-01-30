import type { LLM } from './llm';
import { OpenAILLM } from './openai';
import { TestLLM } from './test';

export const LLMMap: Record<string, LLM> = {
	'gpt-3.5-turbo': new OpenAILLM('gpt-3.5-turbo'),
	'gpt-3.5-turbo-instruct': new OpenAILLM('gpt-3.5-turbo-instruct'),
	'gpt-4-turbo-preview': new OpenAILLM('gpt-4-turbo-preview'),
	'gpt-4': new OpenAILLM('gpt-4'),
	test: new TestLLM()
};
