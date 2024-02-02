import type { LLM } from '../llms/llm';
import { ChainOfThoughtOptimizer } from './ChainOfThoughtOptimizer';
import { NoNegationOptimizer } from './NoNegationOptimizer';
import type { Optimizer } from './optimizer';

export function getOptimizer(type: string, llm: LLM): Optimizer | undefined {
	switch (type) {
		case 'ChainOfThought':
			return new ChainOfThoughtOptimizer(llm);
		case 'NoNegation':
			return new NoNegationOptimizer(llm);
	}
}
