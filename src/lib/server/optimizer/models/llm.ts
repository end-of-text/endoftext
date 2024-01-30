import type { HyperparameterValue } from '$lib/types';

export abstract class LLM {
	public config: Map<string, HyperparameterValue> = new Map();

	abstract completion(prompt: string, input: string): Promise<string>;
}
