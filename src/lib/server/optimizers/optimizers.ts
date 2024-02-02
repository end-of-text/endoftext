import { ChainOfThoughtOptimizer } from './ChainOfThoughtOptimizer';
import { NoNegationOptimizer } from './NoNegationOptimizer';
import { SeparateInstructionOptimizer } from './SeparateInstructionOptimizer';

export const optimizers = [
	new ChainOfThoughtOptimizer(),
	new NoNegationOptimizer(),
	new SeparateInstructionOptimizer()
];
