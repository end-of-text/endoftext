import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

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
	 * @param supabase the supabase client
	 * @returns true if matches the criteria, false otherwise
	 */
	abstract filter(prompt: Tables<'prompts'>, llm: LLM, supabase: SupabaseClient): Promise<boolean>;

	/** Modify the prompt to match the criteria for this optimizer.
	 *
	 * @param prompt the prompt to be modified
	 * @param llm the language model to be used
	 * @param supabase the supabase client
	 * @returns the modified prompt
	 */
	abstract apply(prompt: string, llm: LLM, supabase: SupabaseClient): Promise<string>;
}
