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
	let plotCompact = false;
	let scrollTimeout: number;

	// Initialize data
	onMount(() => {
		items = [...objectiveFountainPens];
		criteria = [...objectiveFountainPenCriteria];
		updateFilteredItems();
	});

	// Update filtered items when items, filters, or search term change
	$: if (items && filters && searchTerm !== undefined) {
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

	function handleItemClick(item: Item) {
		if (item.url) {
			window.open(item.url, '_blank');
		}
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

	// Update plot compact mode based on scroll position
	function handleScroll() {
		// Clear previous timeout
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}
		
		// Debounce the scroll handling
		scrollTimeout = setTimeout(() => {
			const nerdOutSection = document.getElementById('nerdout');
			
			if (nerdOutSection) {
				const nerdOutRect = nerdOutSection.getBoundingClientRect();
				const scrollY = window.scrollY;
				
				// Simple logic with hysteresis to prevent flickering
				if (scrollY < 300) {
					// Near top - definitely normal
					plotCompact = false;
				} else if (scrollY > 500 && nerdOutRect.bottom < 50) {
					// Well scrolled down and section is out of view - compact
					plotCompact = true;
				}
				// Don't change state in between to prevent flickering
			}
		}, 50); // 50ms debounce
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
		};
	});
</script>

<svelte:head>
	<title>Nerdout - Criteria-Based Comparison Tool</title>
	<meta name="description" content="Visualize and compare fountain pens across multiple criteria" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Nerdout</h1>
					<p class="text-sm text-gray-600">Fountain Pen Comparison Tool</p>
				</div>
				
				<nav class="flex space-x-4">
					<button
						on:click={() => scrollToSection('nerdout')}
						class="px-3 py-2 text-sm font-medium rounded-md {currentSection === 'nerdout' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}"
					>
						Nerd Out
					</button>
					<button
						on:click={() => scrollToSection('nerdwayout')}
						class="px-3 py-2 text-sm font-medium rounded-md {currentSection === 'nerdwayout' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}"
					>
						Nerd Way Out
					</button>
					<button
						on:click={() => scrollToSection('nerdwaywayout')}
						class="px-3 py-2 text-sm font-medium rounded-md {currentSection === 'nerdwaywayout' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}"
					>
						Nerd Way Way Out
					</button>
				</nav>

				<div class="text-sm text-gray-600">
					{filteredItems.length} of {items.length} items
				</div>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Introduction -->
		<div class="mb-8 text-center">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">
				Find Your Perfect Fountain Pen
			</h2>
			<p class="text-lg text-gray-600 max-w-3xl mx-auto">
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
				on:filtersChange={handleFiltersChange}
				on:searchChange={handleSearchChange}
			/>
		</div>

		<!-- Nerd Out Section -->
		<section id="nerdout" class="mb-12 relative">
			<!-- Space reservation when plot is compact -->
			{#if plotCompact}
				<div class="h-[580px]"></div> <!-- Reserve space for full plot + margins when compact -->
			{/if}
			
			<div 
				class="{plotCompact ? 'fixed top-20 right-4 z-40 bg-white p-4 rounded-lg shadow-lg' : ''}"
				style={plotCompact ? 'overflow: visible;' : ''}
			>
				<NerdOut
					items={filteredItems}
					{criteria}
					{highlightedItem}
					onItemHover={handleItemHover}
					onItemClick={handleItemClick}
					compact={plotCompact}
				/>
			</div>
		</section>

		<!-- Nerd Way Out Section -->
		<section id="nerdwayout" class="mb-12">
			<NerdWayOut
				items={filteredItems}
				{criteria}
				{highlightedItem}
				onItemUpdate={handleItemUpdate}
				onItemDelete={handleItemDelete}
				onItemHighlight={handleItemHighlight}
				on:addItem={handleItemAdd}
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
	<footer class="bg-white border-t border-gray-200 mt-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="text-center text-gray-600">
				<p class="mb-2">
					Nerdout - A criteria-based comparison tool inspired by 99spokes
				</p>
				<p class="text-sm">
					Built with SvelteKit and D3.js • 
					<a href="https://github.com" class="text-blue-600 hover:text-blue-800">View Source</a>
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