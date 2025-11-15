<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Criterion } from '../types';

	export let criteria: Criterion[] = [];
	export let onCriteriaUpdate: (criteria: Criterion[]) => void = () => {};

	const dispatch = createEventDispatcher();

	// Matrix state: 'up' = row wins, 'left' = column wins, 'equal' = tie
	let comparisonMatrix: Record<string, Record<string, 'up' | 'left' | 'equal'>> = {};
	let matrixInitialized = false;

	const criteriaPriority: Record<string, number> = {
		// Writing performance factors
		nib_material: 100,
		filling_system: 95,
		feed_material: 92,
		grip_section_material: 90,
		nib_size_range: 85,
		// Build & feel
		body_material: 78,
		cap_material: 52,
		// Aesthetics & provenance
		exterior_decoration: 68,
		country_origin: 60,
		// Collectibility & trim
		scarcity: 58,
		cap_style: 44,
		clip_style: 32
	};

	function createPairKey(a: string, b: string): string {
		return [a, b].sort().join('|');
	}

	const equalPreferencePairs = new Set(
		[
			['nib_material', 'filling_system'],
			['feed_material', 'grip_section_material'],
			['nib_size_range', 'body_material'],
			['country_origin', 'scarcity'],
			['cap_material', 'cap_style']
		].map(([a, b]) => createPairKey(a, b))
	);

	function determineDefaultPreference(aId: string, bId: string): 'up' | 'left' | 'equal' {
		if (aId === bId) return 'equal';

		const pairKey = createPairKey(aId, bId);
		if (equalPreferencePairs.has(pairKey)) {
			return 'equal';
		}

		const priorityA = criteriaPriority[aId];
		const priorityB = criteriaPriority[bId];

		if (priorityA === undefined || priorityB === undefined) {
			return 'equal';
		}

		if (priorityA === priorityB) {
			return 'equal';
		}

		return priorityA > priorityB ? 'left' : 'up';
	}

	// Initialize matrix with default values based on research-derived weights
	$: if (criteria.length > 0 && !matrixInitialized) {
		initializeMatrix();
	}

	function initializeMatrix() {
		const matrix: Record<string, Record<string, 'up' | 'left' | 'equal'>> = {};
		
		criteria.forEach(critA => {
			matrix[critA.id] = {};
			criteria.forEach(critB => {
				if (critA.id === critB.id) {
					matrix[critA.id][critB.id] = 'equal';
				} else {
					matrix[critA.id][critB.id] = determineDefaultPreference(critA.id, critB.id);
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
		if (rowId === colId) return 'bg-parchment-200';

		// Non-clickable cells (lower triangle) get gray background
		if (!isClickable(rowIdx, colIdx)) {
			return 'bg-ink-100';
		}

		const comparison = comparisonMatrix[rowId]?.[colId];
		switch (comparison) {
			case 'up': return 'bg-ink-100 hover:bg-ink-200';
			case 'left': return 'bg-brass-100 hover:bg-brass-200';
			case 'equal': return 'bg-parchment-200 hover:bg-parchment-300';
			default: return 'bg-parchment-100 hover:bg-parchment-200';
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
		<h2 class="text-2xl font-bold font-serif text-ink-900">Criteria Comparison Matrix</h2>
		<div class="text-sm text-charcoal-light">
			Click cells to compare criteria importance
		</div>
	</div>

	<div class="bg-parchment-50 rounded-lg border-2 border-ink-200 p-4">
		<p class="text-sm text-charcoal-light mb-4">
			Compare each pair of criteria. Click the upper-right cells to cycle through:
			<span class="inline-flex items-center space-x-1">
				<span class="px-2 py-1 bg-ink-100 rounded text-xs">↑ Column higher priority</span>
				<span class="px-2 py-1 bg-brass-100 rounded text-xs">← Row higher priority</span>
				<span class="px-2 py-1 bg-parchment-200 rounded text-xs">= Equal priority</span>
			</span>
		</p>

		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<th class="w-32"></th>
						{#each criteria as criterion}
							<th class="w-20 p-2 text-xs font-medium text-center border-2 border-ink-200 bg-parchment-100 text-charcoal">
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
							<td class="p-2 text-sm font-medium border-2 border-ink-200 bg-parchment-100 text-right pr-3 text-charcoal">
								{rowCriterion.name}
							</td>
							{#each criteria as colCriterion, colIdx}
								<td class="w-20 h-16 border-2 border-ink-200 p-0">
									{#if isClickable(rowIdx, colIdx)}
										<button
											on:click={() => toggleComparison(rowCriterion.id, colCriterion.id)}
											class="w-full h-full flex items-center justify-center text-lg font-bold cursor-pointer {getCellColor(rowCriterion.id, colCriterion.id, rowIdx, colIdx)} transition-colors text-charcoal"
											title="Click to cycle: {rowCriterion.name} vs {colCriterion.name}"
										>
											{getCellIcon(rowCriterion.id, colCriterion.id)}
										</button>
									{:else}
										<div class="w-full h-full flex items-center justify-center text-lg font-bold {getCellColor(rowCriterion.id, colCriterion.id, rowIdx, colIdx)} text-charcoal-light">
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
