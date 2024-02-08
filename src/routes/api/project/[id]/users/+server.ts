import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals: { supabase, getSession } }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}
	const ownerRes = await supabase
		.from('users')
		.select('*, projects!inner()')
		.eq('projects.id', params.id);
	if (ownerRes.error) {
		error(500, ownerRes.error.message);
	}

	const userRes = await supabase
		.from('users')
		.select('*, user_project!inner()')
		.eq('user_project.project_id', params.id);
	if (userRes.error) {
		error(500, userRes.error.message);
	}

	const finalData = [...ownerRes.data, ...userRes.data];
	return json(finalData);
}

export async function POST({ params, request, locals: { supabase, getSession } }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}
	const requestData = await request.json();
	const projectId = params.id;
	const email = requestData.email;

	const userRes = await supabase.from('users').select('id').eq('email', email);
	if (userRes.error) {
		error(500, userRes.error.message);
	}

	if (userRes.data.length === 0) {
		error(404, 'User not found');
	}

	const res = await supabase
		.from('user_project')
		.insert([{ project_id: projectId, user_id: userRes.data[0].id }])
		.select();

	if (res.error) {
		error(500, res.error.message);
	}
	return json(res.data);
}

export async function DELETE({ params, request, locals: { supabase, getSession } }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}
	const requestData = await request.json();
	const projectId = params.id;
	const userId = requestData.userId;

	const res = await supabase
		.from('user_project')
		.delete()
		.eq('project_id', projectId)
		.eq('user_id', userId);

	if (res.error) {
		error(500, res.error.message);
	}
	return json(res.data);
}
