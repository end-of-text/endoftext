import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { filterSentences, rewriteSentences } from './util';

const canBeSimplifiedPrompt = `
You are a writing assistant. You decide whether a sentence is too complex and should be simplified.
The sentence is too complex if it can be simplified without losing meaning.
The simplified sentence MUST be shorter (have less words) than the original sentence.

### Output
You return JSON with the key "output" set to true if the sentence can be simplified, and false otherwise.
`;

const simplifyPrompt = `
You are an AI writing assistant that rewrites sentences. Rewrite the sentence to simplify it.
A sentence is simplified if it is shorter (has less words) than the original sentence and does not lose meaning.`;

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
