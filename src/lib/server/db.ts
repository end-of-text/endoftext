import type { Entry, Project } from '$lib/types';
import type Table from 'arquero/dist/types/table/table';

// TODO: use real database
const db = new Map<string, Project>();

export function getProject(userId: string): Project | undefined {
	return db.get(userId);
}

export function createProject(userId: string, taskDescription: string) {
	db.set(userId, {
		taskDescription,
		dataEntries: [],
		prompts: []
	} as Project);
}

export function getPrompts(userId: string) {
	const project = getProject(userId);
	if (!project) {
		return [];
	}

	return project.prompts;
}

export function createPrompt(userId: string, text: string) {
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	project.prompts.push({
		id: crypto.randomUUID(),
		text,
		predictions: []
	});
}

export function createPrediction(
	userId: string,
	promptId: string,
	entryId: string,
	prediction: string
) {
	deletePrediction(userId, promptId, entryId);
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	const prompt = project.prompts.find((prompt) => prompt.id === promptId);
	if (!prompt) {
		throw new Error('Prompt not found');
	}

	prompt.predictions.push({
		entryID: entryId,
		prediction
	});
}

export function deletePrediction(userId: string, promptId: string, entryId: string) {
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	const prompt = project.prompts.find((prompt) => prompt.id === promptId);
	if (!prompt) {
		throw new Error('Prompt not found');
	}

	const index = prompt.predictions.findIndex((prediction) => prediction.entryID === entryId);
	if (index !== -1) {
		prompt.predictions.splice(index, 1);
	}
}

export function getEntries(userId: string): Entry[] {
	const project = getProject(userId);
	if (!project) {
		return [];
	}

	return project.dataEntries;
}

export function createEntry(userId: string, text: string) {
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	project.dataEntries.push({
		id: crypto.randomUUID(),
		question: text,
		answer: ''
	});
}

export function createEntries(userId: string, newEntries: Table) {
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	const rows = newEntries.objects();

	rows.forEach((ent) =>
		project.dataEntries.push({
			id: crypto.randomUUID(),
			question: ent.question,
			answer: ent.answer || ''
		} as Entry)
	);
}

export function deleteEntry(userId: string, entryId: string) {
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	const index = project.dataEntries.findIndex((entry) => entry.id === entryId);
	if (index === -1) {
		throw new Error('Entry not found');
	}

	project.dataEntries.splice(index, 1);
}

export function clearEntries(userId: string) {
	const project = getProject(userId);
	if (!project) {
		throw new Error('Project not found');
	}

	project.dataEntries.splice(0, project.dataEntries.length);
}
