function createDataGenerationOptions(initialInstruction: string, initialShow: boolean) {
	let instruction = $state(initialInstruction);
	let show = $state(initialShow);

	return {
		get instruction() {
			return instruction;
		},
		set instruction(value) {
			instruction = value;
		},
		get show() {
			return show;
		},
		set show(value) {
			show = value;
		}
	};
}

export const dataGenerationOptions = createDataGenerationOptions('', false);
