import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

const filterPrompt = `
You are an AI prompt writing critiquer. You decide if a given sentence has more than one instruction. If it has more than one instruction you return true, otherwise return false. Return in JSON format with the key "output".

## Examples
Input: Extract the output and return JSON
Output: { "output": true }
Input: Do not return errors and always be correct
Output: { "output": true }
Input: Always return the correct JSON format
Output: { "output": false }
`;

const editPrompt = `
You are a writing assistant. You split up a sentence into one sentence each for each instruction in the original setence.
`;

export class SingleInstructionEditor extends PromptEditor {
	constructor() {
		super(
			'SingleInstruction',
			'Single Instruction Sentences',
			'Each sentence should only contain one instruction for the model.',
			EditorType.ENHANCEMENT
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		const sentences = prompt.prompt.split('.');

		const requests = sentences.map((sentence) =>
			llm.generate(
				[
					{
						role: 'system',
						content: filterPrompt
					},
					{
						role: 'user',
						content: sentence
					}
				],
				{ json: true, temperature: 0 }
			)
		);

		const results = await Promise.all(requests);

		try {
			if (results.some((res) => JSON.parse(res || '{}')['output'])) {
				return [];
			} else {
				return null;
			}
		} catch (e) {
			return null;
		}
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<string> {
		const sentences = prompt.prompt.split('.');

		const requests = sentences.map((sentence) =>
			llm.generate(
				[
					{
						role: 'system',
						content: filterPrompt
					},
					{
						role: 'user',
						content: sentence
					}
				],
				{ json: true, temperature: 0 }
			)
		);

		let results = await Promise.all(requests);
		results = results.map((res) => JSON.parse(res || '{}')['output']);

		const sentencesToEdit = sentences.filter((_, i) => results[i]);

		const requests2 = sentencesToEdit.map((sentence) =>
			llm.generate([
				{
					role: 'system',
					content: editPrompt
				},
				{
					role: 'user',
					content: sentence
				}
			])
		);

		const results2 = await Promise.all(requests2);
		return results2.join('. ');
	}
}
