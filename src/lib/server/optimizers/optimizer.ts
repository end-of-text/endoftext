import type { LLM } from '$lib/server/llms/llm';

export abstract class Optimizer {
	/** Create a new optimizer.
	 *
	 * @param type the type of the optimizer
	 * @param name human-readable name of the optimizer
	 * @param description description of the optimizer
	 * @param llm the language model to be used
	 */
	constructor(
		public readonly type: string,
		public readonly name: string,
		public readonly description: string
	) {}

	/** Determine if the prompt matches the criteria for this optimizer.
	 *
	 * @param prompt the prompt to be checked
	 * @param llm the language model to be used
	 * @param instancePredictions instances and predictions associated with the prompt
	 * @returns true if matches the criteria, false otherwise
	 */
	abstract filter(
		prompt: string,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	): Promise<boolean>;

	/** Modify the prompt to match the criteria for this optimizer.
	 *
	 * @param prompt the prompt to be modified
	 * @param llm the language model to be used
	 * @param instancePredictions instances and predictions associated with the prompt
	 * @returns the modified prompt
	 */
	abstract apply(
		prompt: string,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	): Promise<string>;
}
