import { error, json } from '@sveltejs/kit';

export async function GET({ params, locals: { supabase } }) {
	const promptRes = await supabase.from('prompts').select('*').eq('id', params.id);

	if (promptRes.error) {
		error(500, promptRes.error.message);
	}
	return json(promptRes.data[0]);
}
