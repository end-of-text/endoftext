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

	async filter(prompt: Tables<'prompts'>, llm: LLM): Promise<boolean> {
		const phrases = prompt.prompt
			.split(/[\.\?\!]/)
			.map((p) => p.trim())
			.filter((p) => p.length > 0);

		const requests = phrases.map((phrase) =>
			llm.generate(
				[
					{
						role: 'system',
						content: instructionClassifierPrompt
					},
					{
						role: 'user',
						content: phrase
					}
				],
				{ json: true, temperature: 0 }
			)
		);

		let results = await Promise.all(requests);
		results = results.map((res) => JSON.parse(res)['output']);

		const instructions = phrases.filter((_, i) => results[i]);

		if (instructions.length === 0) {
			return false;
		}

		const negationRequests = instructions.map((instruction) =>
			llm.generate(
				[
					{
						role: 'system',
						content: negationClassifierPrompt
					},
					{
						role: 'user',
						content: instruction
					}
				],
				{ json: true, temperature: 0 }
			)
		);

		results = await Promise.all(negationRequests);
		results = results.map((res) => JSON.parse(res)['output']);

		return !results.some((res) => res);
	}

	async apply(prompt: Tables<'prompts'>, llm: LLM): Promise<string> {
		const phrasesAndSeparators = prompt.prompt.split(/([.\?!])/).filter((p) => p.length > 0);
		let phrasesAndSeparatorsTracker = new Array(phrasesAndSeparators.length).fill(false);

		phrasesAndSeparatorsTracker = phrasesAndSeparators.map((p, i) =>
			p.length > 1 && p.includes(' ') ? true : false
		);

		let requests = phrasesAndSeparators
			.filter((p, i) => phrasesAndSeparatorsTracker[i])
			.map((phrase) =>
				llm.generate(
					[
						{
							role: 'system',
							content: instructionClassifierPrompt
						},
						{
							role: 'user',
							content: phrase
						}
					],
					{ json: true, temperature: 0 }
				)
			);

		let results = await Promise.all(requests);
		results = results.map((res) => JSON.parse(res)['output']);

		let counter = 0;
		phrasesAndSeparatorsTracker = phrasesAndSeparatorsTracker.map((p, i) => {
			if (p) {
				counter++;
				return results[counter - 1];
			} else {
				return false;
			}
		});

		requests = phrasesAndSeparators
			.filter((p, i) => phrasesAndSeparatorsTracker[i])
			.map((instruction) =>
				llm.generate(
					[
						{
							role: 'system',
							content: negationClassifierPrompt
						},
						{
							role: 'user',
							content: instruction
						}
					],
					{ json: true, temperature: 0 }
				)
			);

		results = await Promise.all(requests);
		results = results.map((res) => JSON.parse(res)['output']);

		counter = 0;
		phrasesAndSeparatorsTracker = phrasesAndSeparatorsTracker.map((p, i) => {
			if (p) {
				counter++;
				return results[counter - 1];
			} else {
				return false;
			}
		});

		requests = phrasesAndSeparators
			.filter((p, i) => phrasesAndSeparatorsTracker[i])
			.map((negation) =>
				llm.generate(
					[
						{
							role: 'system',
							content: removeNegationPrompt
						},
						{
							role: 'user',
							content: negation
						}
					],
					{ temperature: 0 }
				)
			);

		results = await Promise.all(requests);

		counter = 0;
		const ret = phrasesAndSeparators
			.map((p, i) => {
				if (phrasesAndSeparatorsTracker[i]) {
					counter++;
					return results[counter - 1]?.replace(/[.\?!]$/, '');
				} else {
					return p;
				}
			})
			.join('');

		return ret;
	}
}
