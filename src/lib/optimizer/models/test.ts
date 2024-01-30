import { LLM } from './llm';

export class TestLLM extends LLM {
	async completion(prompt: string, input: string): Promise<string> {
		return 'test output for ' + input + ' with prompt ' + prompt;
	}

	copy(): LLM {
		return new TestLLM();
	}
}
