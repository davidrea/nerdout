<script lang="ts">
	import { onMount } from 'svelte';
	import NerdOut from '$lib/components/NerdOut.svelte';
	import NerdWayOut from '$lib/components/NerdWayOut.svelte';
	import NerdWayWayOut from '$lib/components/NerdWayWayOut.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import type { Item, Criterion, FilterRule } from '$lib/types';
	import { applyFilters, searchItems } from '$lib/filtering';
	import { objectiveFountainPens, objectiveFountainPenCriteria } from '$lib/data/objectiveFountainPens';

	let items: Item[] = [];
	let criteria: Criterion[] = [];
	let filteredItems: Item[] = [];
	let filters: FilterRule[] = [];
	let searchTerm: string = '';
	let highlightedItem: string | null = null;
	let currentSection: 'nerdout' | 'nerdwayout' | 'nerdwaywayout' = 'nerdout';

	// Price range filter state
	let priceMin: number = 0;
	let priceMax: number = 10000;
	let selectedPriceMin: number = 0;
	let selectedPriceMax: number = 10000;

	// Initialize data
	onMount(() => {
		items = [...objectiveFountainPens];
		criteria = [...objectiveFountainPenCriteria];

		// Calculate min/max prices from all items
		if (items.length > 0) {
			const costs = items.map(item => item.cost);
			priceMin = Math.floor(Math.min(...costs));
			priceMax = Math.ceil(Math.max(...costs));
			selectedPriceMin = priceMin;
			selectedPriceMax = priceMax;
		}

		updateFilteredItems();
	});

	// Update filtered items when items, filters, search term, or price range change
	$: if (items && filters && searchTerm !== undefined && selectedPriceMin !== undefined && selectedPriceMax !== undefined) {
		updateFilteredItems();
	}

	function updateFilteredItems() {
		let result = [...items];

		// Apply search
		if (searchTerm) {
			result = searchItems(result, searchTerm);
		}

		// Apply filters
		if (filters.length > 0) {
			result = applyFilters(result, filters);
		}

		// Apply price range filter
		result = result.filter(item =>
			item.cost >= selectedPriceMin && item.cost <= selectedPriceMax
		);

		filteredItems = result;
	}

	function handleItemUpdate(updatedItem: Item) {
		// Force reactivity by creating a new array
		items = [...items.map(item => 
			item.id === updatedItem.id ? { ...updatedItem } : item
		)];
		// Explicitly trigger filtered items update
		updateFilteredItems();
	}

	function handleItemAdd(event: CustomEvent<Item>) {
		items = [...items, event.detail];
	}

	function handleItemDelete(itemId: string) {
		items = items.filter(item => item.id !== itemId);
		if (highlightedItem === itemId) {
			highlightedItem = null;
		}
	}

	function handleItemHighlight(itemId: string | null) {
		highlightedItem = itemId;
	}

	function handleItemHover(item: Item | null) {
		highlightedItem = item?.id || null;
	}

	function handleCriteriaUpdate(updatedCriteria: Criterion[]) {
		// Force reactivity by creating a new array
		criteria = [...updatedCriteria.map(c => ({ ...c }))];
	}

	function handleFiltersChange(event: CustomEvent<FilterRule[]>) {
		filters = event.detail;
	}

	function handleSearchChange(event: CustomEvent<string>) {
		searchTerm = event.detail;
	}

	function handlePriceRangeChange(event: CustomEvent<{ min: number, max: number }>) {
		selectedPriceMin = event.detail.min;
		selectedPriceMax = event.detail.max;
	}

	function scrollToSection(section: 'nerdout' | 'nerdwayout' | 'nerdwaywayout') {
		currentSection = section;
		const element = document.getElementById(section);
		if (element) {
			const headerHeight = 80; // Account for sticky header + some padding
			const elementPosition = element.getBoundingClientRect().top + window.scrollY;
			const offsetPosition = elementPosition - headerHeight;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	}

</script>

<svelte:head>
	<title>Nerdout - Criteria-Based Comparison Tool</title>
	<meta name="description" content="Visualize and compare fountain pens across multiple criteria" />
</svelte:head>

<div class="min-h-screen bg-parchment-100">
	<!-- Header -->
	<header class="bg-parchment-50 shadow-sm border-b-2 border-brass-600 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div>
					<h1 class="text-2xl font-bold font-serif text-ink-900 tracking-wide">Nerdout</h1>
					<p class="text-sm text-charcoal-light">Fountain Pen Comparison Tool</p>
				</div>

				<nav class="flex space-x-4">
					<button
						on:click={() => scrollToSection('nerdout')}
						class="px-3 py-2 text-sm font-medium rounded-md transition-colors {currentSection === 'nerdout' ? 'bg-ink-100 text-ink-800' : 'text-charcoal-light hover:text-ink-900 hover:bg-parchment-200'}"
					>
						Nerd Out
					</button>
					<button
						on:click={() => scrollToSection('nerdwayout')}
						class="px-3 py-2 text-sm font-medium rounded-md transition-colors {currentSection === 'nerdwayout' ? 'bg-ink-100 text-ink-800' : 'text-charcoal-light hover:text-ink-900 hover:bg-parchment-200'}"
					>
						Nerd Way Out
					</button>
					<button
						on:click={() => scrollToSection('nerdwaywayout')}
						class="px-3 py-2 text-sm font-medium rounded-md transition-colors {currentSection === 'nerdwaywayout' ? 'bg-ink-100 text-ink-800' : 'text-charcoal-light hover:text-ink-900 hover:bg-parchment-200'}"
					>
						Nerd Way Way Out
					</button>
				</nav>

				<div class="text-sm text-charcoal-light">
					{filteredItems.length} of {items.length} items
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Introduction -->
		<div class="mb-8 text-center">
			<h2 class="text-3xl font-bold font-serif text-ink-900 mb-4 tracking-wide">
				Find Your Perfect Fountain Pen
			</h2>
			<p class="text-lg text-charcoal-light max-w-3xl mx-auto">
				Compare fountain pens across multiple criteria including build quality, writing experience,
				and value. Adjust the importance of different factors to find the pen that's perfect for you.
			</p>
		</div>

		<!-- Filter Panel -->
		<div class="mb-8">
			<FilterPanel
				{items}
				{filters}
				{searchTerm}
				{priceMin}
				{priceMax}
				{selectedPriceMin}
				{selectedPriceMax}
				on:filtersChange={handleFiltersChange}
				on:searchChange={handleSearchChange}
				on:priceRangeChange={handlePriceRangeChange}
			/>
		</div>

		<!-- Nerd Out Section -->
		<section id="nerdout" class="mb-12">
			<NerdOut
				items={filteredItems}
				{criteria}
				{highlightedItem}
				onItemHover={handleItemHover}
			/>
		</section>

		<!-- Nerd Way Out Section -->
		<section id="nerdwayout" class="mb-12">
			<NerdWayOut
				{criteria}
				onCriteriaUpdate={handleCriteriaUpdate}
			/>
		</section>

		<!-- Nerd Way Way Out Section -->
		<section id="nerdwaywayout" class="mb-12">
			<NerdWayWayOut
				{criteria}
				onCriteriaUpdate={handleCriteriaUpdate}
			/>
		</section>
	</main>

	<!-- Footer -->
	<footer class="bg-parchment-50 border-t-2 border-brass-600 mt-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center text-charcoal-light">
				<p class="mb-2">
					Nerdout - A criteria-based comparison tool inspired by 99spokes
				</p>
				<p class="text-sm">
					Built with SvelteKit and D3.js •
					<a href="https://github.com" class="text-ink-700 hover:text-brass-600 transition-colors">View Source</a>
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	/* Smooth scrolling behavior */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Ensure compact plot doesn't overlap content */
	:global(body) {
		padding-top: 0;
	}
</style>
