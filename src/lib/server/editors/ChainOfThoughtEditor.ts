import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class ChainOfThoughtEditor extends PromptEditor {
	constructor() {
		super(
			'ChainOfThought',
			'Chain of Thought Format',
			'Ensure the prompt uses chain-of-thought reasoning.',
			EditorType.ENHANCEMENT
		);
	}

	async filter(prompt: Tables<'prompts'>, llm: LLM): Promise<boolean> {
		if (prompt.responseFormat !== 'text') {
			return false;
		}
		const systemPrompt = `You are an AI prompt writing critiquer. You decide whether a prompt should implement chain-of-thought reasoning. 

### Guidelines
* First, decide if the prompt already implements chain-of-thought reasoning. For example, it might include "think step-by-step". If so, return false.
* If the prompt doesn't implement chain-of-thought reasoning, decide if it should or not. Only prompts for complex reasoning tasks such as arithmetic, commonsense reasoning, and symbolic reasoning tasks require chain-of-thought prompting. If the prompt is one of these, return true.
						
### Output
Return the output in JSON with the key "output" that is either true or false.`;
		const res = await llm.generate(
			[
				{
					role: 'system',
					content: systemPrompt
				},
				{
					role: 'user',
					content: prompt.prompt
				}
			],
			{ json: true }
		);

		if (!res) {
			return false;
		}

		try {
			return JSON.parse(res).output;
		} catch (e) {
			return false;
		}
	}

	async apply(prompt: Tables<'prompts'>, llm: LLM): Promise<string> {
		const res = await llm.generate([
			{
				role: 'system',
				content: `Given a prompt, you append a sentence to the end of the prompt that tells the model to "think step by step". Keep the original prompt unchanged except for this addition.

					Examples:
					Input: Solve the following math problem.
					Output: Solve the following math problem. Think step-by-step`
			}
		]);

		return res || prompt.prompt;
	}
}
