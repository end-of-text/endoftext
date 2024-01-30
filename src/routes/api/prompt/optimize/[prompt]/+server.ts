import { createSearchResults, getProject } from '$lib/server/db.js';
import { exactMatchMetric } from '$lib/server/optimizer/metric.js';
import { HyperparameterSearch } from '$lib/server/optimizer/search.js';
import { HyperparameterType } from '$lib/types';

export async function POST({ params, cookies }) {
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

	const search = new HyperparameterSearch(params.prompt, project.dataEntries, exactMatchMetric, [
		{
			name: 'llm',
			type: HyperparameterType.LLM,
			values: ['test'] //'gpt-3.5-turbo']
		},
		{ name: 'temperature', type: HyperparameterType.SYSTEM, values: [1, 1.5] },
		{ name: 'tip', type: HyperparameterType.PROMPT, values: ['', 'I will tip $100'] }
	]);

	const res = await search.search();
	createSearchResults(id, res);

	return new Response(null, { status: 204 });
}
