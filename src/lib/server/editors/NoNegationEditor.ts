import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class NoNegationEditor extends PromptEditor {
	constructor() {
		super(
			'NoNegation',
			'No Negation Format',
			'Ensure the prompts do not tell models what they *should not* do.',
			EditorType.ERROR
		);
	}

	async filter(prompt: Tables<'prompts'>, llm: LLM): Promise<boolean> {
		const systemPrompt = `### Task
You are an AI prompt writing critiquer. Your task is to determine if a prompt tells a model what **not** to instead of what it should do. 
	
### Instructions
* If the prompt only tells the model what it should do, return true.
* If the prompt instead tells the model what it should **not** do, return false.
	 
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
			{ json: true, temperature: 0 }
		);

		if (!res) {
			return true;
		}

		try {
			const resJSON = JSON.parse(res);
			return resJSON.output;
		} catch (e) {
			return true;
		}
	}

	async apply(prompt: Tables<'prompts'>, llm: LLM): Promise<string> {
		const res = await llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content: `Rewrite the prompt to remove any sentences that tell the model to not do something.\n\nprompt:\n${prompt.prompt}`
			}
		]);

		return res || prompt.prompt;
	}
}
