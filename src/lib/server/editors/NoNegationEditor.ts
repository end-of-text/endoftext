import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

const instructionClassifierPrompt = `
	You are a sentence classifier. You return true if a user's input sentence is an instruction, command, or stating what should be done. Otherwise return false.

	# Output
	Return JSON with the key output with the answer.

	# Examples
	Input: Determine if a prompt specifies the format of the desired JSON output. 
	Output: true
	Input: Classify the sentiment of this movie review.
	Output: true
	Input: Don't return free text
	Output: true
	Input: Who is the president of the united states?
	Output: false`;

const negationClassifierPrompt = `
	You are a sentence classifier. You return true if a user's input sentence contains a negation or says not to do something. Otherwise return false.

	# Output
	Return JSON with the key output with the answer.

	# Examples
	Input: Don't return free text
	Output: true
	Input: I don't want to do that
	Output: true
	Input: I want to do that
	Output: false`;

const removeNegationPrompt = `
	You are an AI writing assistant that rewrites sentences. Rewrite the sentence to remove the negation.
	`;

export class NoNegationEditor extends PromptEditor {
	constructor() {
		super(
			'NoNegation',
			'No Negation Format',
			'Ensure the prompts do not tell models what they *should not* do.',
			EditorType.ERROR
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		const regex = /([^.?!]+[.?!])/g; // Regex to match sentences including the punctuation

		let phrases = [...prompt.prompt.matchAll(regex)].map((match) => {
			console.log(match);
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
							content: instructionClassifierPrompt
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

		phrases = await Promise.all(
			phrases.map(async (phrase) => {
				if (!phrase.candidateSentence) {
					return phrase;
				}
				const res = await llm.generate(
					[
						{
							role: 'system',
							content: negationClassifierPrompt
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
			return phrases
				.filter((p) => p.candidateSentence)
				.map((p) => [p.start, p.end])
				.flat();
		} else {
			return null;
		}
	}

	async rewritePrompt(prompt: Tables<'prompts'>, targetSpans: number[], llm: LLM): Promise<string> {
		// group targetSpans into two-element arrays, simple
		const targets: number[][] = targetSpans.reduce(
			(acc: number[][], val, i) => (
				i % 2 === 0 ? acc.push([val]) : acc[acc.length - 1].push(val), acc
			),
			[]
		);

		// get substrings using targetSpans
		const rewrittenPhrases = await Promise.all(
			targets.map(async (span) => {
				const phrase = prompt.prompt.substring(span[0], span[1] + 1);
				return await llm.generate(
					[
						{
							role: 'system',
							content: removeNegationPrompt
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
				returnPrompt.slice(0, targets[i][0]) +
				(' ' + rewrittenPhrase.trim() + (rewrittenPhrase.trim().endsWith('.') ? '' : '.')) +
				returnPrompt.slice(targets[i][1] + 1);
		});
		return returnPrompt;
	}
}
