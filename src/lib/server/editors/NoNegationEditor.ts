import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { filterSentences, rewriteSentences } from './util';

export class NoNegationEditor extends PromptEditor {
	constructor() {
		super(
			'NoNegation',
			"Don't Use Negative Instructions",
			'Tell the model what it *should* do, not what it *should not* do.',
			EditorType.ERROR
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		const instructionClassifierPrompt = await fetchPrompt('k8IVEdHy', '636');
		const negationClassifierPrompt = await fetchPrompt('MSl2Wa7x', '696');
		return await filterSentences(
			prompt.prompt,
			llm,
			[await instructionClassifierPrompt.text(), await negationClassifierPrompt.text()],
			(sentence) =>
				[' not ', "n't ", ' no ', ' never '].some((negation) =>
					(' ' + sentence.toLowerCase()).includes(negation)
				)
		);
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		const removeNegationPrompt = await fetchPrompt('UDibruqq', '638');
		return {
			...prompt,
			prompt: await rewriteSentences(
				prompt.prompt,
				targetSpans,
				llm,
				await removeNegationPrompt.text()
			)
		};
	}
}
