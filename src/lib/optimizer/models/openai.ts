import { env } from '$env/dynamic/private';
import { OpenAI } from 'openai';
import { LLM } from './llm';

export class OpenAILLM extends LLM {
	private readonly openAI: OpenAI;

	constructor(private readonly gptVersion: string) {
		super();
		this.openAI = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	}

	async completion(prompt: string, input: string): Promise<string> {
		const res = await this.openAI.chat.completions.create({
			model: this.gptVersion,
			messages: [
				{ role: 'system', content: prompt },
				{ role: 'user', content: input }
			],
			temperature: (this.config.get('temperature')?.value as number) || 1,
			frequency_penalty: (this.config.get('frequency_penalty')?.value as number) || 0,
			presence_penalty: (this.config.get('presence_penalty')?.value as number) || 0,
			top_p: (this.config.get('top_p')?.value as number) || 1
		});
		return res.choices[0].message.content || '';
	}

	copy(): LLM {
		return new OpenAILLM(this.gptVersion);
	}
}
