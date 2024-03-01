import { ENDOFTEXT_API_KEY } from '$env/static/private';
import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
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
		const instructionClassifierPrompt = await fetch(
			'https://app.endoftext.app/api/serve/project/k8IVEdHy/636',
			{
				headers: {
					'x-api-key': ENDOFTEXT_API_KEY
				}
			}
		);
		const negationClassifierPrompt = await fetch(
			'https://app.endoftext.app/api/serve/project/MSl2Wa7x/652',
			{
				headers: {
					'x-api-key': ENDOFTEXT_API_KEY
				}
			}
		);
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
		const removeNegationPrompt = await fetch(
			'https://app.endoftext.app/api/serve/project/UDibruqq/638',
			{
				headers: {
					'x-api-key': ENDOFTEXT_API_KEY
				}
			}
		);
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
