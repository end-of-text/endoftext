export interface Entry {
	id: string;
	text: string;
}

export enum GenerationTypes {
	PROMPT = 'prompt',
	SIMILAR = 'similar'
}
