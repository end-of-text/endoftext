import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$env/static/private';
import type { Database } from '$lib/supabase.js';
import { createServerClient } from '@supabase/ssr';
import { error, text } from '@sveltejs/kit';

export async function GET({ request, cookies, params }) {
	const apiKey = request.headers.get('x-api-key');
	if (!apiKey) {
		error(401, 'Unauthorized');
	}

	const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => cookies.get(key),
			set: (key, value, options) => {
				cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				cookies.delete(key, { ...options, path: '/' });
			}
		},
		global: {
			headers: {
				eotkey: apiKey
			}
		}
	});

	const promptRes =
		params.promptId !== undefined
			? await supabase
					.from('prompts')
					.select('*')
					.eq('project_id', params.id)
					.eq('id', params.promptId)
					.order('created_at', { ascending: false })
					.limit(1)
			: await supabase
					.from('prompts')
					.select('*')
					.eq('project_id', params.id)
					.order('created_at', { ascending: false })
					.limit(1);

	if (promptRes.error) {
		error(500, promptRes.error.message);
	}

	if (promptRes.data.length === 0) {
		error(
			500,
			"The prompt you were looking for doesn't exist. Make sure the project and prompt IDs are correct and your API key is valid."
		);
	}

	return text(promptRes.data[0].prompt);
}
