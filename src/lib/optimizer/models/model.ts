import type { ModelConfiguration } from '../search';

export abstract class CausalModel {
	_config: ModelConfiguration | null = null;

	set config(config: ModelConfiguration) {
		this._config = config;
	}

	get config(): ModelConfiguration | null {
		return this._config;
	}

	completion(prompt: string): string {
		throw new Error('Method not implemented.');
	}

	copy(): CausalModel {
		throw new Error('Method not implemented.');
	}
}
