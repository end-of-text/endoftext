import { ChainOfThoughtOptimizer } from './ChainOfThoughtOptimizer';
import { LongerOptimizer } from './LongerOptimizer';
import { NoNegationOptimizer } from './NoNegationOptimizer';
import { SeparateInstructionOptimizer } from './SeparateInstructionOptimizer';
import { ShortenOptimizer } from './ShortenOptimizer';

export const optimizers = [
	new ChainOfThoughtOptimizer(),
	new NoNegationOptimizer(),
	new SeparateInstructionOptimizer(),
	new ShortenOptimizer(),
	new LongerOptimizer()
];
