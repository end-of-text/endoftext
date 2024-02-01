export type Prompt = {
	id: string;
	prompt: string;
	created_at: Date;
};

export type Instance = {
	id: string;
	input: string;
	label: string | undefined;
};

export type Prediction = {
	id: string;
	prediction: string;
	instance_id: string;
	prompt_id: string;
};

export type Metric = {
	id: string;
	metric_name: string;
	metric: number;
	prediction_id: string;
};
