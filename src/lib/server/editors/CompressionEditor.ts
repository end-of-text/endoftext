import { ENDOFTEXT_API_KEY } from '$env/static/private';
import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { filterSentences, rewriteSentences } from './util';

export class CompressionEditor extends PromptEditor {
	constructor() {
		super(
			'Compression',
			'Shorten Prompt',
			'Simplify sentences to shorten your prompt and lower costs.',
			EditorType.OPTIMIZATION
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		const canBeSimplifiedPrompt = await fetch(
			'https://app.endoftext.app/api/serve/project/fT58mFTo/635',
			{
				headers: {
					'x-api-key': ENDOFTEXT_API_KEY
				}
			}
		);
		return await filterSentences(
			prompt.prompt,
			llm,
			[await canBeSimplifiedPrompt.text()],
			(sentence) => sentence.split(' ').length > 15
		);
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		const simplifyPrompt = await fetch('https://app.endoftext.app/api/serve/project/k1-_anGH/697', {
			headers: {
				'x-api-key': ENDOFTEXT_API_KEY
			}
		});
		return {
			...prompt,
			prompt: await rewriteSentences(prompt.prompt, targetSpans, llm, await simplifyPrompt.text())
		};
	}
}
