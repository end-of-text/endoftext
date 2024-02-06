import { env } from '$env/dynamic/private';
import type { Tables } from '$lib/supabase';
import { OpenAILLM } from '../llms/openai';

export async function generateInstances(
	prompt: string,
	instances: Tables<'instances'>[],
	count: number
) {
	const openai = new OpenAILLM(env.OPENAI_API_KEY || '');
	const prediction = await openai.generate(
		[
			{
				role: 'system',
				content: `You are an assistant that generates example inputs for a given AI prompt and example instances.

				### Guidelines
				* The user will provide an AI prompt and example inputs.
				* IGNORE what the user says about what the output should be.
				* Do not repeat the example inputs.
				* Generate new and interesting examples.
				* You return exactly ${count} instances
				* Return JSON format with the key "instances" and the example inputs as an array.
				* The instances should be in plain text unless specified by the prompt.
				* You only return the inputs for the model, NOT the outputs
				`
			},
			{
				role: 'user',
				content: `
			/******* PROMPT BLOCK *******/ 
			${prompt}

			/******* EXAMPLES BLOCK *******/
			${instances
				.sort(() => Math.random() - 0.5)
				.slice(0, 20)
				.map((instance: Tables<'instances'>) => instance.input)
				.join('\n')}
			`
			}
		],
		{ json: true }
	);
	return prediction;
}
