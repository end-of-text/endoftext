import { OpenAI } from 'openai';
import { CausalModel } from './model';

export class OpenAIModel extends CausalModel {
	_openai: OpenAI;

	constructor(apiKey: string) {
		super();
		this._openai = new OpenAI({ apiKey });
	}

	completion(prompt: string): string {
		return prompt + 'my output';
	}

	copy(): CausalModel {
		return new OpenAIModel(this._openai.apiKey);
	}
}
