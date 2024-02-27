export function dataGenerationInstructionState(initialInstruction: string) {
	let dataGenerationInstruction = $state(initialInstruction);

	return {
		get instruction() {
			return dataGenerationInstruction;
		},
		set instruction(value) {
			dataGenerationInstruction = value;
		}
	};
}

export function showDataGenerationState(initialShowGenerateOptions: boolean) {
	let showDataGeneration = $state(initialShowGenerateOptions);

	return {
		get showGenerateOptions() {
			return showDataGeneration;
		},
		set showGenerateOptions(value) {
			showDataGeneration = value;
		}
	};
}
