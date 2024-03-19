import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals: { supabase } }) {
	const promptRes = await supabase.from('prompts').select('id').eq('project_id', params.id);

	if (promptRes.error) {
		error(500, promptRes.error.message);
	}

	return json(promptRes.data.map((p) => p.id));
}
