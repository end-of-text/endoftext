import { OPENAI_API_KEY } from '$env/static/private';
import type { Tables } from '$lib/supabase';
import { fetchPrompt } from '../editors/editors';
import { OpenAILLM } from '../llms/openai';

export async function predictMetric(prompt: Tables<'prompts'> | undefined): Promise<string> {
	if (prompt === undefined) {
		return 'chrf';
	} else if (prompt.responseFormat === 'json') {
		return 'exact match';
	}

	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	const systemPrompt = await fetchPrompt('TEAku3-I', '634');
	const predictedMetric = await openai.generate(
		[
			{ role: 'system', content: await systemPrompt.text() },
			{ role: 'user', content: prompt.prompt }
		],
		{ json: true }
	);
	const metricJson = JSON.parse(predictedMetric || "{output: 'chrf'}");
	if (['chrf', 'exact match', 'fuzzy match'].includes(metricJson.output)) {
		return metricJson.output;
	} else {
		return 'chrf';
	}
}
