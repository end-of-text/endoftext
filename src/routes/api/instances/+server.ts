import { OPENAI_API_KEY } from '$env/static/private';
import { trackEvent } from '$lib/server/amplitude.js';
import { generateInstances } from '$lib/server/instances/generateInstances.js';
import { OpenAILLM } from '$lib/server/llms/openai';
import type { Tables } from '$lib/supabase';
import { error, json } from '@sveltejs/kit';

export async function DELETE({ locals: { getSession, supabase }, request }) {
	const session = await getSession();
	const requestData = await request.json();
	const instanceIds = requestData.instanceIds as number[] | undefined;
	if (!instanceIds) {
		error(500, 'Invalid data');
	}

	const res = await supabase.from('instances').delete().in('id', instanceIds);
	if (res.error) {
		error(500, res.error.message);
	}

	trackEvent(
		'Instances Deleted',
		{ user_id: session?.user.id ?? '' },
		{ number: instanceIds.length }
	);
	return new Response(null, { status: 200 });
}

export async function POST({ locals: { getSession, supabase }, request }) {
	const session = await getSession();
	const requestData = await request.json();
	const prompt = requestData.prompt as Tables<'prompts'> | undefined;
	const instances = requestData.instances as Tables<'instances'>[] | undefined;
	const instruction = requestData.instruction as string | undefined;
	const count = requestData.count as number | undefined;
	if (!prompt || !instances || !count) {
		error(500, 'Invalid data');
	}

	const instancesRes = await generateInstances(prompt.prompt, instances, count, instruction);

	let newInstances: string[] = [];
	try {
		newInstances = JSON.parse(instancesRes || '{}')['instances'];
	} catch (e) {
		error(500, 'Invalid prediction');
	}

	const res = await supabase
		.from('instances')
		.insert(
			newInstances.map((instance: string) => ({ project_id: prompt.project_id, input: instance }))
		)
		.select();

	if (res.error) {
		error(500, res.error.message);
	}

	trackEvent('Instances Generated', { user_id: session?.user.id ?? '' }, { number: count });

	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	const predictions = await Promise.all(
		newInstances.map(
			async (instance) =>
				await openai.generate(
					[
						{ role: 'system', content: prompt.prompt },
						{ role: 'user', content: instance }
					],
					{
						model: prompt.model,
						temperature: prompt.temperature,
						json: prompt.responseFormat === 'json'
					}
				)
		)
	);

	const predictionsRes = await supabase
		.from('predictions')
		.insert(
			predictions.map((prediction, i) => ({
				instance_id: res.data[i].id,
				prompt_id: prompt.id,
				prediction
			}))
		)
		.select();

	if (predictionsRes.error) {
		error(500, predictionsRes.error.message);
	}

	return json({ instances: res.data, predictions });
}
