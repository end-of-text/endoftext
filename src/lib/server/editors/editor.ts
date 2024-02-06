import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import type { EditorType, RequiredInputType } from '$lib/types';

export abstract class PromptEditor {
	/** Create a new prompt editor.
	 *
	 * @param id string identifier of the editor
	 * @param name human-readable name of the editor
	 * @param description description of the editor
	 * @param type type of the editor
	 * @param llm the language model to be used
	 */
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string,
		public readonly type: EditorType,
		public readonly requiredInputType: RequiredInputType | undefined = undefined
	) {}

	/** Determine if the prompt matches the criteria for this editor.
	 *
	 * @param prompt the prompt to be checked
	 * @param llm the language model to be used
	 * @param instancePredictions instances and predictions associated with the prompt
	 * @returns true if matches the criteria, false otherwise
	 */
	abstract filter(
		prompt: Tables<'prompts'>,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	): Promise<boolean>;

	/** Modify the prompt using the editor.
	 *
	 * @param prompt the prompt to be modified
	 * @param llm the language model to be used
	 * @param instancePredictions instances and predictions associated with the prompt
	 * @returns the modified prompt
	 */
	abstract apply(
		prompt: Tables<'prompts'>,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[],
		input: string | unknown
	): Promise<string>;
}
