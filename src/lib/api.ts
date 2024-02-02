import type { Tables } from './supabase';

export async function getPrediction(
	selectedPrompt: Tables<'prompts'> | undefined,
	instance: Tables<'instances'>
): Promise<Tables<'predictions'> | undefined> {
	if (selectedPrompt === undefined) {
		return;
	}

	const response = await fetch(`/api/prediction`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ selectedPrompt: selectedPrompt, instance: instance })
	});
	const jsonResponse = await response.json();
	return jsonResponse as Tables<'predictions'>;
}

export async function updateInstance(instance: Tables<'instances'>) {
	await fetch(`/api/instance`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ instance: instance })
	});
}

export async function getMetric(
	instance: Tables<'instances'>,
	predictionPromise: Promise<Tables<'predictions'> | undefined>
): Promise<Tables<'metrics'> | undefined> {
	const prediction = await predictionPromise;
	if (instance.label === undefined || prediction === undefined) {
		return;
	}

	const response = await fetch(`/api/metric`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			instance: instance,
			prediction: prediction
		})
	});
	const jsonResponse = await response.json();
	return jsonResponse as Tables<'metrics'>;
}

export async function getSuggestions(
	selectedPrompt: Tables<'prompts'> | undefined
): Promise<Tables<'suggestions'>[] | undefined> {
	if (selectedPrompt === undefined) {
		return;
	}

	const response = await fetch(`/api/optimizer/suggestions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ selectedPrompt: selectedPrompt })
	});
	const jsonResponse = await response.json();
	return jsonResponse as Tables<'suggestions'>[];
}

export async function acceptSuggestion(
	selectedPrompt: Tables<'prompts'> | undefined,
	suggestion: Tables<'suggestions'>,
	projectID: string
) {
	if (selectedPrompt === undefined) {
		return;
	}

	await fetch(`/api/optimizer/suggestions/accept`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			selectedPrompt: selectedPrompt,
			suggestion: suggestion,
			projectID: projectID
		})
	});
}
