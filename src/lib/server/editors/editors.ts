import { ChainOfThoughtEditor } from './ChainOfThoughtEditor';
import { JSONEditor } from './JSONEditor';
import { LongerEditor } from './LongerEditor';
import { NoNegationEditor } from './NoNegationEditor';
import { OutputFormatEditor } from './OutputFormatEditor';
import { SeparateInstructionEditor } from './SeparateInstructionEditor';
import { ShortenEditor } from './ShortenEditor';

export const editors = [
	new ChainOfThoughtEditor(),
	new NoNegationEditor(),
	new SeparateInstructionEditor(),
	new ShortenEditor(),
	new LongerEditor(),
	new OutputFormatEditor(),
	new JSONEditor()
];
