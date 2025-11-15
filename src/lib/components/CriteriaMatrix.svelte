<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Criterion } from '../types';

	export let criteria: Criterion[] = [];
	export let onCriteriaUpdate: (criteria: Criterion[]) => void = () => {};

	const dispatch = createEventDispatcher();

	// Matrix state: 'up' = row wins, 'left' = column wins, 'equal' = tie
	let comparisonMatrix: Record<string, Record<string, 'up' | 'left' | 'equal'>> = {};
	let matrixInitialized = false;

	// Initialize matrix with default values based on research-derived weights
	$: if (criteria.length > 0 && !matrixInitialized) {
		initializeMatrix();
	}

	function initializeMatrix() {
		const matrix: Record<string, Record<string, 'up' | 'left' | 'equal'>> = {};
		
		// Create a reasonable default matrix based on typical fountain pen priorities
		// This will be used to calculate the initial weights
		const defaultComparisons: Record<string, 'up' | 'left' | 'equal'> = {
			// Nib Performance vs others (nib is usually most important)
			'nib_performance_vs_build_quality': 'left', // nib wins
			'nib_performance_vs_ink_flow': 'left', // nib wins
			'nib_performance_vs_comfort_ergonomics': 'left', // nib wins
			'nib_performance_vs_filling_system': 'left', // nib wins
			'nib_performance_vs_aesthetics': 'left', // nib wins
			'nib_performance_vs_value': 'equal', // close call
			'nib_performance_vs_maintenance': 'left', // nib wins
			'nib_performance_vs_portability': 'left', // nib wins
			'nib_performance_vs_specialty_features': 'left', // nib wins
			
			// Ink Flow vs others (second most important)
			'ink_flow_vs_build_quality': 'left', // ink flow wins
			'ink_flow_vs_comfort_ergonomics': 'equal', // close call
			'ink_flow_vs_filling_system': 'left', // ink flow wins
			'ink_flow_vs_aesthetics': 'left', // ink flow wins
			'ink_flow_vs_value': 'equal', // close call
			'ink_flow_vs_maintenance': 'left', // ink flow wins
			'ink_flow_vs_portability': 'left', // ink flow wins
			'ink_flow_vs_specialty_features': 'left', // ink flow wins
			
			// Build Quality vs others
			'build_quality_vs_comfort_ergonomics': 'equal',
			'build_quality_vs_filling_system': 'left', // build quality wins
			'build_quality_vs_aesthetics': 'left', // build quality wins
			'build_quality_vs_value': 'equal',
			'build_quality_vs_maintenance': 'equal',
			'build_quality_vs_portability': 'left', // build quality wins
			'build_quality_vs_specialty_features': 'left', // build quality wins
			
			// Value vs others
			'value_vs_comfort_ergonomics': 'equal',
			'value_vs_filling_system': 'left', // value wins
			'value_vs_aesthetics': 'left', // value wins
			'value_vs_maintenance': 'equal',
			'value_vs_portability': 'left', // value wins
			'value_vs_specialty_features': 'left', // value wins
			
			// Remaining comparisons mostly equal or minor preferences
			'comfort_ergonomics_vs_filling_system': 'left',
			'comfort_ergonomics_vs_aesthetics': 'left',
			'comfort_ergonomics_vs_maintenance': 'equal',
			'comfort_ergonomics_vs_portability': 'equal',
			'comfort_ergonomics_vs_specialty_features': 'left',
			
			'filling_system_vs_aesthetics': 'equal',
			'filling_system_vs_maintenance': 'equal',
			'filling_system_vs_portability': 'equal',
			'filling_system_vs_specialty_features': 'left',
			
			'aesthetics_vs_maintenance': 'equal',
			'aesthetics_vs_portability': 'equal',
			'aesthetics_vs_specialty_features': 'equal',
			
			'maintenance_vs_portability': 'left',
			'maintenance_vs_specialty_features': 'left',
			
			'portability_vs_specialty_features': 'equal'
		};
		
		criteria.forEach(critA => {
			matrix[critA.id] = {};
			criteria.forEach(critB => {
				if (critA.id === critB.id) {
					matrix[critA.id][critB.id] = 'equal';
				} else {
					// Look up the default comparison
					const key1 = `${critA.id}_vs_${critB.id}`;
					const key2 = `${critB.id}_vs_${critA.id}`;
					
					if (defaultComparisons[key1]) {
						matrix[critA.id][critB.id] = defaultComparisons[key1];
					} else if (defaultComparisons[key2]) {
						// Reverse the comparison
						const reversed = defaultComparisons[key2];
						if (reversed === 'left') {
							matrix[critA.id][critB.id] = 'up';
						} else if (reversed === 'up') {
							matrix[critA.id][critB.id] = 'left';
						} else {
							matrix[critA.id][critB.id] = 'equal';
						}
					} else {
						// Default to equal if not specified
						matrix[critA.id][critB.id] = 'equal';
					}
				}
			});
		});
		
		comparisonMatrix = matrix;
		matrixInitialized = true;
		
		// Calculate weights from the default matrix
		calculateWeights();
	}

	function toggleComparison(rowId: string, colId: string) {
		if (rowId === colId) return; // Don't allow self-comparison
		
		const current = comparisonMatrix[rowId]?.[colId] || 'equal';
		let next: 'up' | 'left' | 'equal';
		
		// Cycle through: up -> left -> equal -> up
		// 'up' means row wins (higher priority), 'left' means column wins (higher priority)
		switch (current) {
			case 'up': next = 'left'; break;
			case 'left': next = 'equal'; break;
			case 'equal': next = 'up'; break;
			default: next = 'up';
		}
		
		// Create new matrix object to ensure reactivity
		const newMatrix = { ...comparisonMatrix };
		
		// Ensure row exists
		if (!newMatrix[rowId]) {
			newMatrix[rowId] = {};
		}
		if (!newMatrix[colId]) {
			newMatrix[colId] = {};
		}
		
		// Update the matrix and its mirror
		newMatrix[rowId][colId] = next;
		
		// Mirror the comparison (reverse the preference)
		if (next === 'up') {
			// Up means column wins, so mirror should be left (row wins from that perspective)
			newMatrix[colId][rowId] = 'left';
		} else if (next === 'left') {
			// Left means row wins, so mirror should be up (column wins from that perspective)
			newMatrix[colId][rowId] = 'up';
		} else {
			newMatrix[colId][rowId] = 'equal';
		}
		
		// Update the matrix
		comparisonMatrix = newMatrix;
		
		// Recalculate weights
		calculateWeights();
	}

	function calculateWeights() {
		// Use a more stable algorithm based on pairwise comparison wins
		const winCounts: Record<string, number> = {};
		const comparisons: Record<string, number> = {};
		
		// Initialize counts
		criteria.forEach(c => {
			winCounts[c.id] = 0;
			comparisons[c.id] = 0;
		});
		
		// Count wins and total comparisons for each criterion
		criteria.forEach((critA, i) => {
			criteria.slice(i + 1).forEach(critB => {
				const comparison = comparisonMatrix[critA.id][critB.id];
				
				comparisons[critA.id]++;
				comparisons[critB.id]++;
				
				if (comparison === 'up') {
					// Up arrow points to column (column wins/higher priority)
					winCounts[critB.id]++;
				} else if (comparison === 'left') {
					// Left arrow points to row (row wins/higher priority)
					winCounts[critA.id]++;
				} else {
					// Equal - give half point to each
					winCounts[critA.id] += 0.5;
					winCounts[critB.id] += 0.5;
				}
			});
		});
		
		// Calculate weights based on win ratio, with some baseline weight
		const weights: Record<string, number> = {};
		const baseWeight = 0.05; // Minimum weight for any criterion
		
		criteria.forEach(c => {
			const winRatio = comparisons[c.id] > 0 ? winCounts[c.id] / comparisons[c.id] : 0.5;
			weights[c.id] = baseWeight + (winRatio * (1 - baseWeight * criteria.length));
		});
		
		// Normalize weights to sum to 1
		const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
		Object.keys(weights).forEach(id => {
			weights[id] = weights[id] / total;
		});
		
		// Update criteria with new weights
		const updatedCriteria = criteria.map(c => ({
			...c,
			weight: weights[c.id] || 0
		}));
		
		onCriteriaUpdate(updatedCriteria);
	}

	function getCellIcon(rowId: string, colId: string): string {
		if (rowId === colId) return '=';
		
		const comparison = comparisonMatrix[rowId]?.[colId];
		switch (comparison) {
			case 'up': return '↑';
			case 'left': return '←';
			case 'equal': return '=';
			default: return '=';
		}
	}

	function getCellColor(rowId: string, colId: string, rowIdx: number, colIdx: number): string {
		if (rowId === colId) return 'bg-gray-200';
		
		// Non-clickable cells (lower triangle) get gray background
		if (!isClickable(rowIdx, colIdx)) {
			return 'bg-gray-300';
		}
		
		const comparison = comparisonMatrix[rowId]?.[colId];
		switch (comparison) {
			case 'up': return 'bg-blue-100 hover:bg-blue-200';
			case 'left': return 'bg-green-100 hover:bg-green-200';
			case 'equal': return 'bg-yellow-100 hover:bg-yellow-200';
			default: return 'bg-gray-100 hover:bg-gray-200';
		}
	}

	function isClickable(rowIdx: number, colIdx: number): boolean {
		// Only upper triangle is clickable (excluding diagonal)
		return rowIdx < colIdx;
	}

	$: sortedCriteria = [...criteria].sort((a, b) => b.weight - a.weight);

</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Criteria Comparison Matrix</h2>
		<div class="text-sm text-gray-600">
			Click cells to compare criteria importance
		</div>
	</div>

	<div class="bg-white rounded-lg border border-gray-200 p-4">
		<p class="text-sm text-gray-600 mb-4">
			Compare each pair of criteria. Click the upper-right cells to cycle through: 
			<span class="inline-flex items-center space-x-1">
				<span class="px-2 py-1 bg-blue-100 rounded text-xs">↑ Column higher priority</span>
				<span class="px-2 py-1 bg-green-100 rounded text-xs">← Row higher priority</span>
				<span class="px-2 py-1 bg-yellow-100 rounded text-xs">= Equal priority</span>
			</span>
		</p>

		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<th class="w-32"></th>
						{#each criteria as criterion}
							<th class="w-20 p-2 text-xs font-medium text-center border border-gray-300 bg-gray-50">
								<div class="leading-tight">
									{criterion.name}
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each criteria as rowCriterion, rowIdx}
						<tr>
							<td class="p-2 text-sm font-medium border border-gray-300 bg-gray-50 text-right pr-3">
								{rowCriterion.name}
							</td>
							{#each criteria as colCriterion, colIdx}
								<td class="w-20 h-16 border border-gray-300 p-0">
									{#if isClickable(rowIdx, colIdx)}
										<button
											on:click={() => toggleComparison(rowCriterion.id, colCriterion.id)}
											class="w-full h-full flex items-center justify-center text-lg font-bold cursor-pointer {getCellColor(rowCriterion.id, colCriterion.id, rowIdx, colIdx)} transition-colors"
											title="Click to cycle: {rowCriterion.name} vs {colCriterion.name}"
										>
											{getCellIcon(rowCriterion.id, colCriterion.id)}
										</button>
									{:else}
										<div class="w-full h-full flex items-center justify-center text-lg font-bold {getCellColor(rowCriterion.id, colCriterion.id, rowIdx, colIdx)}">
											{getCellIcon(rowCriterion.id, colCriterion.id)}
										</div>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

</div>