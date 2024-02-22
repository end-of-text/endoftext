export const enum EditorType {
	ENHANCEMENT = 'ENHANCEMENT',
	OPTIMIZATION = 'OPTIMIZATION',
	ERROR = 'ERROR'
}

export const enum RequiredInputType {
	TEXT = 'TEXT'
}

export type TooltipStateType = {
	hover: boolean;
	mousePos: { x: number; y: number };
	text: string | undefined;
};

export const metrics = ['chrf', 'exact match', 'fuzzy match', 'length'];
