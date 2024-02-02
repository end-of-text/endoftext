import type { LLM } from '../llms/llm';
import { Optimizer } from './optimizer';

export class ChainOfThoughtOptimizer extends Optimizer {
	constructor(llm: LLM) {
		super('Chain of Thought Format', 'Ensure the prompt uses chain-of-thought reasoning.', llm);
	}

	async filter(prompt: string): Promise<boolean> {
		const res = await this.llm.generate(
			[
				{
					role: 'system',
					content:
						'You are an AI prompt writing critiquer. Given the following prompt, you return JSON with the key `output` that is either true if the prompt matches the user description or false otherwise.'
				},
				{
					role: 'user',
					content:
						'Prompts should have a statement telling the model to use chain-of-thought reasoning, something like "think step by step". Does this prompt contain a statement telling it to think step-by-step?\n\nprompt: ' +
						prompt
				}
			],
			true
		);

		if (!res) {
			return false;
		}

		try {
			const resJSON = JSON.parse(res);
			return resJSON.output;
		} catch (e) {
			return false;
		}
	}

	async apply(prompt: string): Promise<string> {
		const res = await this.llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content:
					'Rewrite the prompt to include a sentence near the end that tells the model to do chain-of-thought reasoning with something like "think step by step".\n\nprompt: ' +
					prompt
			}
		]);

		return res || prompt;
	}
}