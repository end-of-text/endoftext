import type { LLM } from '../llms/llm';
import { Optimizer } from './optimizer';

export class NoNegationOptimizer extends Optimizer {
	constructor(llm: LLM) {
		super(
			'No Negation Format',
			'Ensure the prompts do not tell models what they *should not* do.',
			llm
		);
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
						'Prompts should not tell the model to not do certain behavior. Does this prompt tell the model to not behave in a certain way?\n\nprompt: ' +
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
					'Rewrite the prompt to remove any sentences that tell the model to not do something.\n\nprompt: ' +
					prompt
			}
		]);

		return res || prompt;
	}
}
