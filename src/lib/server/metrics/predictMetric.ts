import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAILLM } from '../llms/openai';

const METRIC_PROMPT = `
You pick an evaluation metric for a given AI prompt. 

You can pick from the following metrics:
"chrf" - measures the bi-gram overlap of two text spans. Good for generative tasks such as summarization, text generation, etc.
"exact match" - measures if prediction and label are identical. Good for logical or exact tasks such as data parsing
"fuzzy match" - measures if the prediction has at least part of the label.

Return JSON with the key "output" and the string of the metric.
`;

export async function predictMetric(prompt: string | undefined): Promise<string> {
	if (prompt === undefined) {
		return 'chrf';
	}
	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	const predictedMetric = await openai.generate(
		[
			{ role: 'system', content: METRIC_PROMPT },
			{ role: 'user', content: prompt }
		],
		{ json: true }
	);
	const metricJson = JSON.parse(predictedMetric || "{output: 'chrf'}");
	return metricJson.output;
}
