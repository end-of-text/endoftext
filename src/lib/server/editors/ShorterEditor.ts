import { PromptEditor } from '$lib/server/editors/editor';
import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import { EditorType } from '$lib/types';

export class ShorterEditor extends PromptEditor {
	constructor() {
		super('Shorter', 'Shorter', 'Make the predictions of the model shorter.', EditorType.ERROR);
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
		if (instancePredictions.length === 0 || prompt.responseFormat !== 'text') {
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
			return [];
		}
		return null;
	}

	async rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[][],
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	): Promise<Tables<'prompts'>> {
		const labelLengths = [];
		for (const instance of instancePredictions) {
			labelLengths.push(instance.label.length);
		}
		const averageLabelLength =
			labelLengths.reduce((sum, length) => sum + length, 0) / labelLengths.length;

		return {
			...prompt,
			prompt:
				prompt.prompt +
				`\n\nYour answer should be about ${Math.floor(averageLabelLength)} characters long.`
		};
	}
}
