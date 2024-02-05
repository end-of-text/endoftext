import { ChainOfThoughtEditor } from './ChainOfThoughtEditor';
import { LongerEditor } from './LongerEditor';
import { NoNegationEditor } from './NoNegationEditor';
import { SeparateInstructionEditor } from './SeparateInstructionEditor';
import { ShortenEditor } from './ShortenEditor';

export const editors = [
	new ChainOfThoughtEditor(),
	new NoNegationEditor(),
	new SeparateInstructionEditor(),
	new ShortenEditor(),
	new LongerEditor()
];
