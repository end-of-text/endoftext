import { ChainOfThoughtEditor } from './ChainOfThoughtEditor';
import { LongerEditor } from './LongerEditor';
import { NoNegationEditor } from './NoNegationEditor';
import { OutputFormatEditor } from './OutputFormatEditor';
import { SeparateInstructionEditor } from './SeparateInstructionEditor';
import { ShortenEditor } from './ShortenEditor';
import { JSONInstructionEditor } from './json/JSONInstructionEditor';
import { JSONDescriptionEditor } from './json/JsonDescriptionEditor';

export const editors = [
	new ChainOfThoughtEditor(),
	new NoNegationEditor(),
	new SeparateInstructionEditor(),
	new ShortenEditor(),
	new LongerEditor(),
	new OutputFormatEditor(),
	new JSONInstructionEditor(),
	new JSONDescriptionEditor()
];
