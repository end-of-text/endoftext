import { EditorType, PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';

export class SeparateInstructionEditor extends PromptEditor {
	constructor() {
		super(
			'SeparateInstruction',
			'Separate Instructions',
			'Separate the prompt instructions from the rest of the prompt.',
			EditorType.ENHANCEMENT
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
						'The instruction of what the task is that the model has to solve should be separated clearly from the rest of the prompt. Is the task instruction in this prompt well separated from other information in the prompt?\n\nprompt: ' +
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
					"Rewrite the prompt so that the description of the model's task is clearly separated from the remaining instructions and information in the prompt. For example, you could rewrite it according to this format:\n### Instruction ###\n{instruction}\n\n{other information}\n\nprompt: " +
					prompt
			}
		]);

		return res || prompt;
	}
}
