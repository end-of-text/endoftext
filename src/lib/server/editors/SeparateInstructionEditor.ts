import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class SeparateInstructionEditor extends PromptEditor {
	constructor() {
		super(
			'SeparateInstruction',
			'Separate Instructions',
			'Separate the prompt instructions from the rest of the prompt.',
			EditorType.ENHANCEMENT
		);
	}

	async filter(prompt: Tables<'prompts'>, llm: LLM): Promise<boolean> {
		const res = await llm.generate(
			[
				{
					role: 'system',
					content: `You are an AI prompt writing critiquer. You decide if a prompt could be split into a task instruction and other information.

						### Guidelines
						1. Check whether it makes sense to separate the task instruction from the rest of the prompt. For example, if there is only a task instruction and no other information, return false.
						2. If the task instruction is already clearly separated, return false.
						3. If it makes sense to separate the task instruction from the rest of the prompt and the instruction is not already sparated, return true.

						### Output
						Return the output in JSON with the key "output" that is either true or false.`
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
			const resJSON = JSON.parse(res);
			return resJSON.output;
		} catch (e) {
			return false;
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
				content: `Rewrite the prompt so that the description of the model's task is clearly separated from the remaining instructions and information in the prompt. For example, you could rewrite it according to this format:\n### Instruction ###\n{instruction}\n\n{other information}\n\nprompt:\n${prompt.prompt}`
			}
		]);

		return res || prompt.prompt;
	}
}
