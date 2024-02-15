import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';
import { filterSentences, rewriteSentences } from './util';

const instructionPrompt = `
You are a writing editor. Your job is to decide if a given sentence is an instruction or command.
If the sentence is an instruction or command, return true. Otherwise, return false.
Return in JSON format with the key "output".

## Examples
Input: Extract the output and return JSON
Output: true
Input: You are a helpful assistant.
Output: false
Input: I will tip you well.
Output: false
Input: Do not return errors and always be correct
Output: true
Input: Always return the correct JSON format
Output: true
`;

const multipleInstructionPrompt = `
You are an AI prompt writing critiquer. 
You decide if a given sentence has more than one instruction. 
If it has more than one instruction you return true, otherwise return false. 
Return in JSON format with the key "output".

## Examples
Input: Extract the output and return JSON
Output: true 
Input: Only return pig latin
Output: false
Input: Do not return errors and always be correct
Output: true 
Input: Always return the correct JSON format
Output: true 
Input: DO NOT lie to me.
Output: false
`;

const editPrompt = `
You are a writing assistant. 
You split up a sentence into one sentence each for each instruction in the original setence.
You MUST return two sentences with no newline and a period at the end of each sentence.
Ensure the meaning of the two new sentences is the same as the original sentence.
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
		return await filterSentences(prompt.prompt, llm, [
			instructionPrompt,
			multipleInstructionPrompt
		]);
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<string> {
		return await rewriteSentences(prompt.prompt, targetSpans, llm, editPrompt);
	}
}
