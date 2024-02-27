export function createDataGenerationState(initial: {
	instruction: string;
	showGenerateOptions: boolean;
}) {
	let instruction = $state('');
	let showGenerateOptions = $state(false);

	return {
		...initial,
		get instruction() {
			return instruction;
		},
		get showGenerateOptions() {
			return showGenerateOptions;
		},
		set instruction(value) {
			instruction = value;
		},
		set showGenerateOptions(value) {
			showGenerateOptions = value;
		}
	};
}
