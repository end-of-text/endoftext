import { env } from '$env/dynamic/private';
import { OpenAILLM } from '$lib/server/llms/openai';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { getSession }, request }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const requestData = await request.json();
	const prompt = requestData.prompt as string | undefined;
	const count = requestData.count as number | undefined;
	if (!prompt || !count) {
		error(500, 'Invalid data');
	}

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

	return json({ output: prediction });
}
