import type { LLM } from '../llms/llm';

export abstract class Optimizer {
	/** Create a new optimizer.
	 *
	 * @param name human-readable name of the optimizer
	 * @param description description of the optimizer
	 * @param llm the language model to be used
	 */
	constructor(
		public readonly name: string,
		public readonly description: string,
		protected llm: LLM
	) {}

	/** Determine if the prompt matches the criteria for this optimizer.
	 *
	 * @param prompt the prompt to be checked
	 * @returns true if matches the criteria, false otherwise
	 */
	abstract filter(prompt: string): Promise<boolean>;

	/** Modify the prompt to match the criteria for this optimizer.
	 *
	 * @param prompt the prompt to be modified
	 * @returns the modified prompt
	 */
	abstract apply(prompt: string): Promise<string>;
}
