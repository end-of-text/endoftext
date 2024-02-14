import { ChainOfThoughtEditor } from './ChainOfThoughtEditor';
import { LongerEditor } from './LongerEditor';
import { NoNegationEditor } from './NoNegationEditor';
import { OutputDescriptionEditor } from './OutputDescriptionEditor';
import { OutputLabelsEditor } from './OutputLabelsEditor';
import { SeparateInstructionEditor } from './SeparateInstructionEditor';
import { ShortenEditor } from './ShortenEditor';
import { SingleInstructionEditor } from './SingleInstructionEditor';
import { JSONInstructionEditor } from './json/JSONInstructionEditor';
import { JSONDescriptionEditor } from './json/JsonDescriptionEditor';

export const editors = [
	new ChainOfThoughtEditor(),
	new NoNegationEditor(),
	new SeparateInstructionEditor(),
	new ShortenEditor(),
	new LongerEditor(),
	new OutputLabelsEditor(),
	new JSONInstructionEditor(),
	new JSONDescriptionEditor(),
	new OutputDescriptionEditor(),
	new SingleInstructionEditor()
];
