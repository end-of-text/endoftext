import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { filterSentences, rewriteSentences } from './util';

const canBeSimplifiedPrompt = await fetchPrompt('fT58mFTo', '635');
const simplifyPrompt = await fetchPrompt('k1-_anGH', '697');

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
		return await filterSentences(
			prompt.prompt,
			llm,
			[canBeSimplifiedPrompt],
			(sentence) => sentence.split(' ').length > 15
		);
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		return {
			...prompt,
			prompt: await rewriteSentences(prompt.prompt, targetSpans, llm, simplifyPrompt)
		};
	}
}
