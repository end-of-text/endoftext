import { CompressionEditor } from './CompressionEditor';
import { LongerEditor } from './LongerEditor';
import { NoNegationEditor } from './NoNegationEditor';
import { OutputDescriptionEditor } from './OutputDescriptionEditor';
import { PersonaEditor } from './PersonaEditor';
import { SeparateInstructionEditor } from './SeparateInstructionEditor';
import { ShortenEditor } from './ShortenEditor';
import { ConvertToJSONEditor } from './json/ConvertToJsonEditor';
import { JSONDescriptionEditor } from './json/JSONDescriptionEditor';
import { JSONInstructionEditor } from './json/JSONInstructionEditor';

export const editors = [
	new NoNegationEditor(),
	new SeparateInstructionEditor(),
	new ShortenEditor(),
	new LongerEditor(),
	new JSONInstructionEditor(),
	new JSONDescriptionEditor(),
	new OutputDescriptionEditor(),
	new CompressionEditor(),
	new ConvertToJSONEditor(),
	new PersonaEditor()
];
