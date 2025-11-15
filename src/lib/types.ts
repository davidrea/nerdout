export interface CriterionValue {
	value: string;
	score: number; // 1-5 user-assigned score for this value
}

export interface Criterion {
	id: string;
	name: string;
	description?: string;
	weight: number;
	values: Record<string, CriterionValue>; // possible values and their scores
	defaultScore: number; // default score for neutral criteria (typically 3)
}

export interface Item {
	id: string;
	name: string;
	cost: number;
	description?: string;
	url?: string;
	specs: Record<string, string | null>; // criterion id -> spec value (or null if N/A)
}

export interface CriterionComparison {
	criterionAId: string;
	criterionBId: string;
	preference: 'A' | 'B' | 'equal'; // which criterion is preferred
}

export interface FilterRule {
	attribute: string;
	operator: 'equals' | 'greater' | 'less' | 'contains' | 'in';
	value: any;
}