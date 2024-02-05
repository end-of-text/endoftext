import { env } from '$env/dynamic/private';
import { OpenAILLM } from '../llms/openai';

export async function generateInstances(prompt: string, count: number) {
	const openai = new OpenAILLM(env.OPENAI_API_KEY || '');
	const prediction = await openai.generate(
		[
			{
				role: 'system',
				content: `You are an assistant that generates example inputs for a given AI prompt. You return exactly ${count} instances in JSON format with the key "instances" and the example inputs as an array. The instances should be in plain text unless specified by the prompt. You only return the inputs for the model, NOT the outputs`
			},
			{ role: 'user', content: prompt }
		],
		true
	);
	return prediction;
}
