import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class ShortenEditor extends PromptEditor {
	constructor() {
		super('Shorten', 'Shorten', 'Make the predictions of the model shorter.', EditorType.ERROR);
	}

	async canBeApplied(
		prompt: Tables<'prompts'>,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	) {
		if (instancePredictions.length === 0) {
			return null;
		}

		const labelLengths = [];
		const predictionLengths = [];
		for (const instance of instancePredictions) {
			labelLengths.push(instance.label.length);
			predictionLengths.push(instance.predictions[0].prediction.length);
		}
		const averageLabelLength =
			labelLengths.reduce((sum, length) => sum + length, 0) / labelLengths.length;
		const averagePredictionLenth =
			predictionLengths.reduce((sum, length) => sum + length, 0) / predictionLengths.length;

		if (averageLabelLength * 1.3 < averagePredictionLenth) {
			return null;
		}
		return [];
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM
	): Promise<Tables<'prompts'>> {
		const res = await llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content: `Rewrite the prompt so that the answers produced by the model are shorter.\n\nprompt:\n${prompt.prompt}`
			}
		]);

		return { ...prompt, prompt: res || prompt.prompt };
	}
}
