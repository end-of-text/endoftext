import type { LLM } from '$lib/server/llms/llm';
import { Optimizer } from '$lib/server/optimizers/optimizer';
import type { Tables } from '$lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export class LongerOptimizer extends Optimizer {
	constructor() {
		super('Longer', 'Longer', 'Make the predictions of the model longer.');
	}

	async filter(prompt: Tables<'prompts'>, llm: LLM, supabase: SupabaseClient): Promise<boolean> {
		const instanceRes = await supabase
			.from('instances')
			.select('id, input, label, predictions!inner(prediction)')
			.eq('project_id', prompt.project_id)
			.eq('predictions.prompt_id', prompt.id)
			.neq('label', '')
			.order('id', { ascending: true });

		if (!instanceRes.data || instanceRes.data.length === 0) {
			return false;
		}

		const labelLengths = [];
		const predictionLengths = [];
		for (const elemnt of instanceRes.data) {
			labelLengths.push(elemnt.label.length);
			predictionLengths.push(elemnt.predictions[0].prediction.length);
		}
		const averageLabelLength =
			labelLengths.reduce((sum, length) => sum + length, 0) / labelLengths.length;
		const averagePredictionLenth =
			predictionLengths.reduce((sum, length) => sum + length, 0) / predictionLengths.length;

		if (averagePredictionLenth * 1.3 < averageLabelLength) {
			return true;
		}
		return false;
	}

	async apply(prompt: string, llm: LLM): Promise<string> {
		const res = await llm.generate([
			{
				role: 'system',
				content:
					'You are an AI assistant that rewrites prompts given the specified criteria. Only return the new prompt.'
			},
			{
				role: 'user',
				content:
					'Rewrite the prompt so that the answers produced by the model are longer.\n\nprompt:' +
					prompt
			}
		]);

		return res || prompt;
	}
}
