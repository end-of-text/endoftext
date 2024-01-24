import { OPENAI_API_KEY } from '$env/static/private';
import { createEntry, getEntries } from '$lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
	default: async ({ request, cookies }) => {
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

		if (prompt) {
			const completion = await openai.chat.completions.create({
				messages: [
					{
						role: 'system',
						content: `You are a data generation assistant. You always reply in JSON format with an array where each entry has a "text" key and the output value. You return exactly ${numberOfEntries} results.`
					},
					{ role: 'system', content: prompt.toString() }
				],
				model: 'gpt-3.5-turbo-1106',
				response_format: { type: 'json_object' }
			});
			try {
				const entries = JSON.parse(completion.choices[0].message.content || '');
				for (const entry of entries.results) {
					createEntry(id, entry.text);
				}
			} catch {
				// ignore
			}
		}
	}
};
