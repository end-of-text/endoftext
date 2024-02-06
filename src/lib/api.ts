import type { Tables } from './supabase';

export async function getPrediction(
	prompt: Tables<'prompts'>,
	instanceId: number,
	input: string
): Promise<string> {
	if (input === '') {
		return '';
	}

	const response = await fetch(`/api/prediction`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt, instanceId, input })
	});
	const res = await response.json();
	return res.output as string;
}

export async function updateInstance(instance: Tables<'instances'>) {
	await fetch(`/api/instance`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ instance: instance })
	});
}

export async function deleteInstance(instanceId: number) {
	await fetch(`/api/instance/${instanceId}`, {
		method: 'DELETE'
	});
}

export async function createInstance(projectId: string) {
	const res = await fetch(`/api/instance`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ projectId: projectId })
	});
	const json = await res.json();
	return json as Tables<'instances'>;
}

export async function updatePrompt(prompt: Tables<'prompts'>): Promise<Tables<'prompts'>> {
	const res = await fetch(`/api/prompt`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt })
	});
	const json = await res.json();
	return json as Tables<'prompts'>;
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
	selectedPrompt: Tables<'prompts'> | undefined,
	instanceUpdated?: number | undefined
): Promise<Tables<'suggestions'>[]> {
	if (selectedPrompt === undefined) {
		return [];
	}

	const response = await fetch(`/api/editor/suggestions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ selectedPrompt: selectedPrompt, instanceUpdated: instanceUpdated })
	});
	const jsonResponse = await response.json();
	return jsonResponse as Tables<'suggestions'>[];
}

export async function acceptSuggestion(
	selectedPrompt: string | undefined,
	suggestion: Tables<'suggestions'>,
	projectID: string
): Promise<string> {
	if (selectedPrompt === undefined) {
		return '';
	}

	const res = await fetch(`/api/editor/suggestions/accept`, {
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
	const json = await res.json();
	return json.prompt as string;
}
