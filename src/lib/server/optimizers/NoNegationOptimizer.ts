import type { LLM } from '$lib/server/llms/llm';
import { Optimizer } from '$lib/server/optimizers/optimizer';

export class NoNegationOptimizer extends Optimizer {
	constructor() {
		super(
			'NoNegation',
			'No Negation Format',
			'Ensure the prompts do not tell models what they *should not* do.'
		);
	}

	async filter(prompt: string, llm: LLM): Promise<boolean> {
		const res = await llm.generate(
			[
				{
					role: 'system',
					content:
						'You are an AI prompt writing critiquer. Given the following prompt, you return JSON with the key `output` that is either true if the prompt matches the user description or false otherwise.'
				},
				{
					role: 'user',
					content:
						'Prompts should not instruct the model about undesirable behavior. Does this prompt tell the model to not behave in a certain way?\n\nprompt: ' +
						prompt
				}
			],
			{ json: true }
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

	async apply(prompt: string, llm: LLM): Promise<string> {
		const res = await llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content:
					'Rewrite the prompt to remove any sentences that tell the model to not do something.\n\nprompt: ' +
					prompt
			}
		]);

		return res || prompt;
	}
}
