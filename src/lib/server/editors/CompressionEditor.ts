import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

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
		const regex = /([^.?!]+[.?!])/g; // Regex to match sentences including the punctuation

		let phrases = [...prompt.prompt.matchAll(regex)].map((match) => {
			return {
				phrase: match[0].trim(), // The matched sentence
				start: match.index || 0, // The start index of the match in the original string
				end: (match.index || 0) + match[0].length - 1, // The end index of the match
				candidateSentence: false
			};
		});

		phrases = await Promise.all(
			phrases.map(async (phrase) => {
				const res = await llm.generate(
					[
						{
							role: 'system',
							content: canBeSimplifiedPrompt
						},
						{
							role: 'user',
							content: phrase.phrase
						}
					],
					{ json: true, temperature: 0 }
				);
				const output = JSON.parse(res || '{}')['output'];
				return { ...phrase, candidateSentence: Boolean(output) };
			})
		);

		if (phrases.some((p) => p.candidateSentence)) {
			return phrases.filter((p) => p.candidateSentence).map((p) => [p.start, p.end]);
		} else {
			return null;
		}
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<string> {
		const rewrittenPhrases = await Promise.all(
			targetSpans.map(async (span) => {
				const phrase = prompt.prompt.substring(span[0], span[1] + 1);
				return await llm.generate(
					[
						{
							role: 'system',
							content: simplifyPrompt
						},
						{
							role: 'user',
							content: phrase
						}
					],
					{ temperature: 0 }
				);
			})
		);

		let returnPrompt = prompt.prompt;
		rewrittenPhrases.forEach((rewrittenPhrase, i) => {
			if (rewrittenPhrase === null) {
				return;
			}
			returnPrompt =
				returnPrompt.slice(0, targetSpans[i][0]) +
				(' ' + rewrittenPhrase.trim() + (rewrittenPhrase.trim().endsWith('.') ? '' : '.')) +
				returnPrompt.slice(targetSpans[i][1] + 1);
		});

		return returnPrompt;
	}
}
