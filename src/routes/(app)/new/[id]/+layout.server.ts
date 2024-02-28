import type { Tables } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase } }) {
	const { data: projectData, error: projectError } = await supabase
		.from('projects')
		.select('*')
		.eq('id', params.id);

	if (projectError) {
		error(500, projectError.message);
	}

	const { data: promptData, error: promptError } = await supabase
		.from('prompts')
		.select('prompt')
		.eq('project_id', params.id)
		.order('created_at', { ascending: false });	

	if (promptError) {
		error(500, promptError.message);
	} 

	return {
		prompt: promptData[0] as Tables<'prompts'>,
		project: projectData[0] as Tables<'projects'>
	};
}
