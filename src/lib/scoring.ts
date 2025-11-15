import type { Criterion, Item, CriterionComparison } from './types';

export function calculateWeightsFromComparisons(
	criteria: Criterion[],
	comparisons: CriterionComparison[]
): Record<string, number> {
	// Simple pairwise comparison to weight calculation
	// Start with equal weights
	const weights: Record<string, number> = {};
	criteria.forEach(c => weights[c.id] = 1);

	// Adjust weights based on comparisons
	comparisons.forEach(comp => {
		if (comp.preference === 'A') {
			weights[comp.criterionAId] += 0.1;
			weights[comp.criterionBId] -= 0.1;
		} else if (comp.preference === 'B') {
			weights[comp.criterionBId] += 0.1;
			weights[comp.criterionAId] -= 0.1;
		}
	});

	// Normalize weights to sum to 1
	const total = Object.values(weights).reduce((sum, w) => sum + Math.max(0.1, w), 0);
	Object.keys(weights).forEach(id => {
		weights[id] = Math.max(0.1, weights[id]) / total;
	});

	return weights;
}

export function calculateItemScore(item: Item, criteria: Criterion[]): number {
	let totalScore = 0;
	let totalWeight = 0;

	criteria.forEach(criterion => {
		const specValue = item.specs[criterion.id];
		let criterionScore = criterion.defaultScore; // Default for N/A or neutral cases
		
		// If item has this spec and we have a score for this value
		if (specValue && criterion.values[specValue]) {
			criterionScore = criterion.values[specValue].score;
		}
		
		// Convert 1-5 scale to percentage and apply criterion weight
		const normalizedScore = (criterionScore / 5) * 100;
		totalScore += normalizedScore * criterion.weight;
		totalWeight += criterion.weight;
	});

	return totalWeight > 0 ? (totalScore / totalWeight) : 0;
}