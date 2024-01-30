import { createPrediction, getProject } from '$lib/server/db.js';
import { openai } from '$lib/server/openai.js';

export async function GET({ params, cookies }) {
	const id = cookies.get('userid');
	if (!id) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const project = getProject(id);
	if (!project) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const prompt = project.prompts.find((prompt) => prompt.id === params.id);
	if (!prompt) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const entry = project.dataEntries.find((entry) => entry.id === params.entryId);
	if (!entry) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const prediction = prompt.predictions.find((prediction) => prediction.entryID === params.entryId);
	if (!prediction) {
		const answer = await openai.generate([
			{
				role: 'system',
				content: prompt.text
			},
			{
				role: 'user',
				content: entry.question
			}
		]);
		if (!answer) {
			return {
				status: 403,
				body: 'Forbidden'
			};
		}
		createPrediction(id, params.id, params.entryId, answer);
		return new Response(answer, { status: 201 });
	}

	return new Response(prediction.prediction, { status: 200 });
}
