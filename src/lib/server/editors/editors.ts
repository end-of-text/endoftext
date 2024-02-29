import type { RootNode } from '$lib/hypertune/generated';
import { CompressionEditor } from './CompressionEditor';
import { NoNegationEditor } from './NoNegationEditor';
import { OutputDescriptionEditor } from './OutputDescriptionEditor';
import { PersonaEditor } from './PersonaEditor';
import { SeparateInstructionEditor } from './SeparateInstructionEditor';
import type { PromptEditor } from './editor';
import { JSONDescriptionEditor } from './json/JSONDescriptionEditor';
import { JSONInstructionEditor } from './json/JSONInstructionEditor';
import { JSONOutputEditor } from './json/JSONOutputEditor';

export function getEditors(hypertuneRoot?: RootNode): PromptEditor[] {
	const editors = [
		{
			editor: new NoNegationEditor(),
			enabled: hypertuneRoot?.noNegationEditor().get(false) ?? false
		},
		{
			editor: new SeparateInstructionEditor(),
			enabled: hypertuneRoot?.separateInstructionsEditor().get(false) ?? false
		},
		{
			editor: new JSONInstructionEditor(),
			enabled: hypertuneRoot?.jsonInstructionEditor().get(false) ?? false
		},
		{
			editor: new JSONDescriptionEditor(),
			enabled: hypertuneRoot?.jsonDescriptionEditor().get(false) ?? false
		},
		{
			editor: new OutputDescriptionEditor(),
			enabled: hypertuneRoot?.outputDescriptionEditor().get(false) ?? false
		},
		{
			editor: new CompressionEditor(),
			enabled: hypertuneRoot?.compressionEditor().get(false) ?? false
		},
		{
			editor: new JSONOutputEditor(),
			enabled: hypertuneRoot?.convertToJSONEditor().get(false) ?? false
		},
		{ editor: new PersonaEditor(), enabled: hypertuneRoot?.personaEditor().get(false) ?? false }
	];
	return hypertuneRoot
		? editors.filter((editor) => editor.enabled).map((editor) => editor.editor)
		: editors.map((editor) => editor.editor);
}
