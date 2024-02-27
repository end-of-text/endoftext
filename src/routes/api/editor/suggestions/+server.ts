import { getHypertuneRoot } from '$lib/hypertune/hypertune.js';
import { getSuggestions } from '$lib/server/editors/getSuggestions.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, getSession }, request }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Unauthorized');
	}

	const requestData = await request.json();
	const selectedPrompt = requestData.selectedPrompt as Tables<'prompts'> | undefined;
	if (!selectedPrompt) {
		error(500, 'Invalid prompt data');
	}

	const hypertuneRoot = await getHypertuneRoot(session.user);
	return json(await getSuggestions(supabase, selectedPrompt, true, hypertuneRoot));
}
