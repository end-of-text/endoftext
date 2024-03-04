import type { LLM } from '$lib/server/llms/llm';
import { fetchPrompt } from '$lib/server/prompts.js';
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

		const systemPrompt = await fetchPrompt('UOqod93D', '699');
		const res = await llm.generate(
			[
				{
					role: 'system',
					content: await systemPrompt.text()
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
		const systemPrompt = await fetchPrompt('11FacQYr', '612');
		const res = await llm.generate([
			{
				role: 'system',
				content: await systemPrompt.text()
			},
			{
				role: 'user',
				content: `prompt:\n${prompt.prompt}\n\nPersona:\n${input}\n\nmodified prompt:`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
