import { createEntry, getEntries } from '$lib/server/db';
import { openai } from '$lib/server/openai.js';

export function load({ cookies }) {
	let id = cookies.get('userid');

	if (!id) {
		id = crypto.randomUUID();
		cookies.set('userid', id, { path: '/' });
	}

	return {
		entries: getEntries(id) || []
	};
}

export const actions = {
	generateFromPrompt: async ({ request, cookies }) => {
		const id = cookies.get('userid');
		if (!id) {
			return {
				status: 403,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const prompt = formData.get('prompt');
		const numberOfEntries = formData.get('numberOfEntries');

		if (prompt && numberOfEntries) {
			const completion = await openai.generateFromPrompt(
				parseInt(numberOfEntries.toString()),
				prompt.toString()
			);
			try {
				for (const entry of completion) {
					createEntry(id, entry.text);
				}
			} catch (e) {
				console.error(e);
			}
		}
	},
	generateSimilar: async ({ request, cookies }) => {
		const id = cookies.get('userid');
		if (!id) {
			return {
				status: 403,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const numberOfEntries = formData.get('numberOfEntries');
		const samples = formData.get('elements');

		if (numberOfEntries && samples) {
			const completion = await openai.generateSimilar(
				parseInt(numberOfEntries.toString()),
				JSON.parse(samples.toString())
			);
			try {
				for (const entry of completion) {
					createEntry(id, entry.text);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}
};
