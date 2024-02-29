import { error } from '@sveltejs/kit';

export async function PUT({ params, locals: { supabase, getSession } }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Unauthorized');
	}

	const projectId = params.id;

	const oldProjectReq = supabase.from('projects').select('name').eq('id', projectId);
	const oldPromptReq = supabase
		.from('prompts')
		.select('*')
		.eq('project_id', projectId)
		.order('created_at', { ascending: false })
		.limit(1);
	const oldInstancesReq = supabase.from('instances').select('*').eq('project_id', projectId);

	const [oldProjectRes, oldPromptRes, oldInstancesRes] = await Promise.all([
		oldProjectReq,
		oldPromptReq,
		oldInstancesReq
	]);

	if (oldProjectRes.error || oldPromptRes.error || oldInstancesRes.error) {
		error(500, 'Error getting old project');
	}

	const oldProject = oldProjectRes.data[0];
	const oldPrompt = oldPromptRes.data[0];
	const oldInstances = oldInstancesRes.data;

	const newProjectRes = await supabase
		.from('projects')
		.insert({ name: `${oldProject.name} (Copy)`, user_id: session.user.id })
		.select('*');

	if (newProjectRes.error) {
		error(500, 'Error creating new project');
	}
	const newProject = newProjectRes.data[0];

	const newPromptRes = await supabase
		.from('prompts')
		.insert({ prompt: oldPrompt.prompt, project_id: newProject.id })
		.select('*');

	if (newPromptRes.error) {
		error(500, 'Error creating new prompt');
	}

	const newInstancesRes = await supabase.from('instances').insert(
		oldInstances.map((instance) => ({
			project_id: newProject.id,
			input: instance.input,
			label: instance.label
		}))
	);

	if (newInstancesRes.error) {
		error(500, 'Error creating new instances');
	}

	return new Response('', {
		status: 200
	});
}
