import type { Tables } from './supabase';

export async function getPrediction(
	selectedPrompt: Tables<'prompts'>,
	instance: Tables<'instances'>
): Promise<string> {
	if (instance.input === '') {
		return '';
	}

	const response = await fetch(`/api/prediction`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ selectedPrompt: selectedPrompt, instance: instance })
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

export async function updatePrompt(id: number, prompt: string) {
	await fetch(`/api/prompt`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id: id, prompt: prompt })
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
	selectedPrompt: string | undefined,
	suggestion: Tables<'suggestions'>,
	projectID: string
): Promise<string> {
	if (selectedPrompt === undefined) {
		return '';
	}

	const res = await fetch(`/api/optimizer/suggestions/accept`, {
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
