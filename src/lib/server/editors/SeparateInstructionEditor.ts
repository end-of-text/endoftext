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

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		const systemPrompt = `You are an AI prompt writing critiquer. You decide if a prompt could be split into a task instruction and other information.

### Guidelines
1. Check whether it makes sense to separate the task instruction from the rest of the prompt. For example, if there is only a task instruction and no other information, return false.
2. If the task instruction is already clearly separated, return true.
3. If it makes sense to separate the task instruction from the rest of the prompt and the instruction is not already sparated, return false.

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
			return null;
		}

		try {
			const resJSON = JSON.parse(res);
			return resJSON.output ? [] : null;
		} catch (e) {
			return null;
		}
	}

	async rewritePrompt(prompt: Tables<'prompts'>, targetSpans: number[], llm: LLM): Promise<string> {
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
