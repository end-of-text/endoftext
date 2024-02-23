import { trackEvent } from '$lib/server/amplitude.js';
import { generateInstances } from '$lib/server/instances/generateInstances.js';
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
	return json({ instances: res.data });
}
