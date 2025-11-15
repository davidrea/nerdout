<script lang="ts">
	import type { Criterion } from '../types';
	import CriteriaMatrix from './CriteriaMatrix.svelte';

	export let criteria: Criterion[] = [];
	export let onCriteriaUpdate: (criteria: Criterion[]) => void = () => {};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Nerd Way Way Out</h2>
		<div class="text-sm text-gray-600">
			{criteria.length} criteria • Adjust relative importance using pairwise comparisons
		</div>
	</div>

	<!-- Criteria comparison matrix -->
	{#if criteria.length > 1}
		<div>
			<h3 class="text-lg font-semibold mb-4">Criteria Weight Matrix</h3>
			<p class="text-sm text-gray-600 mb-4">Compare criteria pairwise to determine their relative weights. The matrix reflects typical fountain pen enthusiast preferences.</p>
			<CriteriaMatrix 
				{criteria} 
				{onCriteriaUpdate}
			/>
		</div>
	{/if}

</div>