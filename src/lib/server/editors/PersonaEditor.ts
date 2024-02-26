import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType, RequiredInputType } from '$lib/types';
import { PromptEditor } from './editor';

export class PersonaEditor extends PromptEditor {
	constructor() {
		super(
			'Persona',
			'Persona',
			'You could improve your prompt by giving the model a persona to act as.',
			EditorType.ENHANCEMENT,
			RequiredInputType.TEXT
		);
	}

	async canBeApplied(prompt: Tables<'prompts'>, llm: LLM) {
		if (prompt.responseFormat === 'json') {
			return null;
		}

		const systemPrompt = `### Role
You are an AI prompting expert. For a prompt that the user provides you, you evaluate whether that prompt could be improved by adding a persona.
		
### Instruction
Does the prompt ask the model to act as a specific persona? If so, return true.
A persona description could be something like "You are a friendly AI assistant that helps people with their homework.", or "You are a grumpy old person that hates technology.", or "act as a python interpreter".
		
### Output Format
Return the output in JSON with the key "output" that is either true or false.`;

		const res = await llm.generate(
			[
				{
					role: 'system',
					content: systemPrompt
				},
				{
					role: 'user',
					content: prompt.prompt
				}
			],
			{ json: true, temperature: 0 }
		);

		if (!res) {
			return null;
		}

		try {
			return !JSON.parse(res).output ? [] : null;
		} catch (e) {
			return null;
		}
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		target_spans: number[][],
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[],
		input: string | unknown
	): Promise<Tables<'prompts'>> {
		const systemPrompt = `You are an AI assistant that rewrites prompts to include a description of the persona of the AI model. Users provide a prompt and a persona description. Your task is to add a description of the persona to the prompt.

### Instructions
* You do not modify the prompt in any other way. Specifically the general instruction AND formatting of the propmt should not be changed. 
* Make sure the desired persona is added somewhere towards the end of the prompt.
* Only return the new prompt in plain text without any other information or formatting.

A persona description could be something like "You are a friendly AI assistant that helps people with their homework.", or "You are a grumpy old person that hates technology.".`;
		const res = await llm.generate([
			{
				role: 'system',
				content: systemPrompt
			},
			{
				role: 'user',
				content: `prompt:\n${prompt.prompt}\n\nPersona:\n${input}\n\nmodified prompt:`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
