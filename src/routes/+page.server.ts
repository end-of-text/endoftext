import { createEntry } from '$lib/server/db';
import { openai } from '$lib/server/openai';
import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	let id = cookies.get('userid');

	if (!id) {
		id = crypto.randomUUID();
		cookies.set('userid', id, { path: '/' });
	}

	return {
		dataDescription: openai.dataDescription
	};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const id = cookies.get('userid');
		if (!id) {
			return {
				status: 403,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const prompt = formData.get('dataDescription');

		if (prompt) {
			const completion = await openai.getInitialSamples(3, prompt.toString());
			try {
				for (const entry of completion) {
					createEntry(id, entry.text);
				}
			} catch (e) {
				console.error(e);
			}
			redirect(303, '/triage');
		}
	}
};
