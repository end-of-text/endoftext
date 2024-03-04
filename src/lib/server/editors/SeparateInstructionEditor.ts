import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
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
		const systemPrompt = await fetchPrompt('gaakzVMP', '607');
		const res = await llm.generate(
			[
				{
					role: 'system',
					content: await systemPrompt.text()
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

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		const systemPrompt = await fetchPrompt('q8vKqE5b', '669');
		const res = await llm.generate([
			{
				role: 'system',
				content: await systemPrompt.text()
			},
			{
				role: 'user',
				content: `Rewrite the prompt so that the description of the model's task is clearly separated from the remaining instructions and information in the prompt. For example, you could rewrite it according to this format:\n### Instruction ###\n{instruction}\n\n{other information}\n\nprompt:\n${prompt.prompt}`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
