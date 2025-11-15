<script lang="ts">
	import type { Criterion, CriterionValue } from '../types';

	export let criteria: Criterion[] = [];
	export let onCriteriaUpdate: (criteria: Criterion[]) => void = () => {};

	let expandedCriteria: Set<string> = new Set();

	function toggleExpand(criterionId: string) {
		if (expandedCriteria.has(criterionId)) {
			expandedCriteria.delete(criterionId);
		} else {
			expandedCriteria.add(criterionId);
		}
		expandedCriteria = expandedCriteria;
	}

	function updateCriterionValueScore(criterionId: string, valueKey: string, score: number) {
		const updatedCriteria = criteria.map(criterion => {
			if (criterion.id === criterionId) {
				return {
					...criterion,
					values: {
						...criterion.values,
						[valueKey]: {
							...criterion.values[valueKey],
							score: score
						}
					}
				};
			}
			return criterion;
		});
		onCriteriaUpdate(updatedCriteria);
	}

</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Nerd Way Out</h2>
		<div class="text-sm text-gray-600">
			{criteria.length} criteria • Click to expand and score individual spec values
		</div>
	</div>

	<!-- Individual Criteria with Value Scoring -->
	<div class="space-y-4">
		<h3 class="text-lg font-semibold">Score Specification Values</h3>
		<p class="text-sm text-gray-600 mb-4">
			Adjust how much you value each specification. These scores (1-5) determine how items are rated.
		</p>
		<div class="space-y-2">
			{#each criteria as criterion}
				{@const isExpanded = expandedCriteria.has(criterion.id)}
				<div class="border border-gray-200 rounded-lg">
					<button
						on:click={() => toggleExpand(criterion.id)}
						class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded-lg"
					>
						<div class="flex-1">
							<div class="font-semibold text-lg">{criterion.name}</div>
							{#if criterion.description}
								<div class="text-sm text-gray-600 mt-1">{criterion.description}</div>
							{/if}
							<div class="text-xs text-gray-500 mt-1">
								Weight: {(criterion.weight * 100).toFixed(1)}% • {Object.keys(criterion.values).length} values
							</div>
						</div>
						<svg 
							class="w-5 h-5 text-gray-400 transform transition-transform {isExpanded ? 'rotate-180' : ''}"
							fill="currentColor" 
							viewBox="0 0 20 20"
						>
							<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
						</svg>
					</button>

					{#if isExpanded}
						<div class="border-t border-gray-200 p-4 bg-gray-50">
							<div class="space-y-3">
								<h4 class="font-medium text-gray-900">Score Each Value (1-5 scale)</h4>
								<p class="text-sm text-gray-600">1 = Poor, 3 = Average, 5 = Excellent</p>
								<div class="grid gap-3">
									{#each Object.entries(criterion.values) as [valueKey, valueData]}
										<div class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
											<div class="flex-1">
												<div class="font-medium">{valueData.value}</div>
											</div>
											<div class="flex items-center space-x-2">
												<input
													type="range"
													min="1"
													max="5"
													step="1"
													value={valueData.score}
													on:input={(e) => updateCriterionValueScore(criterion.id, valueKey, parseInt(e.currentTarget.value))}
													class="w-24"
												/>
												<span class="w-8 text-sm text-center font-mono">{valueData.score}</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>