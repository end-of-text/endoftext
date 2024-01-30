export interface Project {
	taskDescription: string;
	dataEntries: Entry[];
	prompts: Prompt[];
}

export interface Entry {
	id: string;
	question: string;
	answer: string;
}

export enum GenerationTypes {
	PROMPT = 'prompt',
	SIMILAR = 'similar'
}

export interface Prompt {
	id: string;
	text: string;
	predictions: Prediction[];
}

export interface Prediction {
	entryID: string;
	prediction: string;
}
