<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import type { Item, Criterion } from '../types';
	import { calculateItemScore } from '../scoring';

	export let items: Item[] = [];
	export let criteria: Criterion[] = [];
	export let highlightedItem: string | null = null;
	export let onItemHighlight: (itemId: string | null) => void = () => {};

	const dispatch = createEventDispatcher();

	let expandedItems: Set<string> = new Set();
	function toggleExpand(itemId: string) {
		if (expandedItems.has(itemId)) {
			expandedItems.delete(itemId);
			onItemHighlight(null);
		} else {
			expandedItems.add(itemId);
			onItemHighlight(itemId);
		}
		expandedItems = expandedItems;
	}

	let shouldAnimate = false;
	let lastSortedItems: Item[] = [];
	let stableOrder: Item[] = [];
	let sortedItems: Item[] = [];

	$: {
		// Guard against SSR and empty data
		if (items && criteria && calculateItemScore) {
			if (expandedItems.size === 0) {
				// No items expanded - sort normally and update stable order
				const newSortedItems = [...items].sort((a, b) => {
					const scoreA = calculateItemScore(a, criteria);
					const scoreB = calculateItemScore(b, criteria);
					return scoreB - scoreA;
				});
				sortedItems = newSortedItems;
				stableOrder = [...newSortedItems];
			} else {
				// Items are expanded - maintain the stable order
				sortedItems = stableOrder.length > 0 ? [...stableOrder] : [...items];
			}
		} else {
			// Fallback for SSR or when data is not ready
			sortedItems = items || [];
		}
	}

	// Detect when sorting changes to trigger animations
	$: {
		if (lastSortedItems.length > 0 && expandedItems.size === 0) {
			const orderChanged = !sortedItems.every((item, index) => 
				lastSortedItems[index]?.id === item.id
			);
			shouldAnimate = orderChanged;
		}
		lastSortedItems = [...sortedItems];
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Nerd Way Out</h2>
		<div class="text-sm text-gray-600">
			{items.length} items • Click to expand for specifications
		</div>
	</div>


	<!-- Items list -->
	<div class="space-y-2">
		{#each sortedItems || items as item (item.id)}
			{@const isExpanded = expandedItems.has(item.id)}
			{@const isHighlighted = highlightedItem === item.id}
			{@const totalScore = calculateItemScore(item, criteria)}
			
			<div 
				class="border border-gray-200 rounded-lg {isHighlighted ? 'ring-2 ring-blue-500' : ''} transition-all duration-300"
				animate:flip={{ duration: 400, easing: quintOut }}
			>
				<div class="flex items-center justify-between p-4">
					<button
						on:click={() => toggleExpand(item.id)}
						class="flex-1 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 rounded p-2"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<div class="font-semibold text-lg">{item.name}</div>
								<div class="text-sm text-gray-600 mt-1">
									Score: {totalScore.toFixed(1)} • Cost: ${item.cost}
								</div>
							</div>
							<svg 
								class="w-5 h-5 text-gray-400 transform transition-transform {isExpanded ? 'rotate-180' : ''}"
								fill="currentColor" 
								viewBox="0 0 20 20"
							>
								<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
							</svg>
						</div>
					</button>
				</div>

				{#if isExpanded}
					<div class="border-t border-gray-200 p-4 bg-gray-50">
						<!-- Specifications -->
						{#if Object.keys(item.specs).length > 0}
							<div>
								<h5 class="font-medium text-gray-900 mb-3">Specifications</h5>
								<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
									{#each Object.entries(item.specs) as [key, value]}
										{#if value !== null}
											<div>
												<span class="text-gray-600 capitalize">{key.replace(/_/g, ' ')}: </span>
												<span class="font-medium">
													{#if Array.isArray(value)}
														{value.join(', ')}
													{:else}
														{value.replace(/_/g, ' ')}
													{/if}
												</span>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}

						{#if item.url}
							<div class="mt-4 pt-3 border-t border-gray-300">
								<a 
									href={item.url} 
									target="_blank" 
									rel="noopener noreferrer"
									class="text-blue-600 hover:text-blue-800 text-sm"
								>
									View Product Page →
								</a>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>