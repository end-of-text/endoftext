import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { filterSentences, rewriteSentences } from './util';

const instructionClassifierPrompt = `
You are a sentence classifier. You return true if a user's input sentence is an instruction, command, or stating what should be done. Return true if any part of the sentence is an instruction. Otherwise return false.

### Output
Return JSON with the key output with the answer.

### Examples
Input: Determine if a prompt specifies the format of the desired JSON output. 
Output: true
Input: Classify the sentiment of this movie review.
Output: true
Input: You are a helpful assistant.
Output: false
Input: Don't be lazy and be a helpful assistant.
Output: true
Input: Don't return free text.
Output: true
Input: You are a helpful assistant and you return JSON always
Output: true
Input: Who is the president of the united states?
Output: false`;

const negationClassifierPrompt = `
You are a sentence classifier. You return true if a user's input sentence contains a negation or says not to do something. Otherwise return false.

### Output
Return JSON with the key output with the answer.

### Examples
Input: DO NOT be lazy. 
Output: true
Input: Even if you want to, do not return a false positive.
Output: true
Input: I don't like ice cream.
Output: false
Input: There is nothing to be done.
Output: false
Input: don't you dare return xml
Output: true
Input: Always return an array of numbers.
Output: false`;

const removeNegationPrompt = `
You are an AI writing assistant that rewrites sentences. 
Rewrite the sentence to say what the model *should* do instead of *should not* do.
Ensure the meaning of the new sentence is the same as the original sentence.

### Examples
Input: Don't be lazy and be a helpful assistant.
Output: Be a helpful assistant.
Input: NEVER return null.
Output: Always return a non-null value.
Input: Don't return free text.
Output: Always return JSON.
`;

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
		return await filterSentences(
			prompt.prompt,
			llm,
			[instructionClassifierPrompt, negationClassifierPrompt],
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
		return {
			...prompt,
			prompt: await rewriteSentences(prompt.prompt, targetSpans, llm, removeNegationPrompt)
		};
	}
}
