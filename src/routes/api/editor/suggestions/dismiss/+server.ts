import { trackEvent } from '$lib/server/amplitude.js';
import { getEditors } from '$lib/server/editors/editors.js';
import type { Tables } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';

export async function DELETE({ request, locals: { supabase, getSession } }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Unauthorized');
	}
	const requestData = await request.json();
	const suggestion = requestData.suggestion as Tables<'suggestions'> | undefined;
	if (!suggestion) {
		error(500, 'Invalid suggestion data');
	}

	const editor = getEditors().find((o) => o.id === suggestion.identifier);
	if (!editor) {
		error(500, 'Could not find editor');
	}

	const { error: err } = await supabase.from('suggestions').delete().eq('id', suggestion.id);

	if (err) {
		error(500, 'Error deleting suggestion');
	}

	trackEvent(
		'Suggestion Dismissed',
		{ user_id: session?.user.id ?? '' },
		{ editor_name: editor.name }
	);

	return new Response(null, { status: 204 });
}
