<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import * as d3 from 'd3';
	import type { Item, Criterion } from '../types';
	import { calculateItemScore } from '../scoring';

	type PlotItem = Item & { score: number };
	type SpecEntry = [string, string | string[] | null];
	const QUICK_FIND_INPUT_ID = 'nerdout-quick-find';

	export let items: Item[] = [];
	export let criteria: Criterion[] = [];
	export let highlightedItem: string | null = null;
	export let onItemHover: (item: Item | null) => void = () => {};

	let svgElement: SVGSVGElement;
	let expandedItems: Set<string> = new Set();
	let tooltip: HTMLDivElement;
	let containerElement: HTMLDivElement;
	let listSearchTerm: string = '';
	let selectedItemId: string | null = null;
	let selectedItemSpecs: SpecEntry[] = [];
	
	// Responsive dimensions
	let containerWidth = 800;
	let containerHeight = 500;
	
	$: svgWidth = containerWidth;
	$: svgHeight = Math.max(containerWidth * 0.6, 400);
	
	// Observe container size changes
	function updateDimensions() {
		if (containerElement) {
			const rect = containerElement.getBoundingClientRect();
			containerWidth = Math.max(rect.width || 400, 300); // Minimum 300px
			containerHeight = Math.max(containerWidth * 0.6, 400);
		}
	}

	$: plotData = (items || []).map(item => ({
		...item,
		score: calculateItemScore(item, criteria || [])
	}));
	$: sortedPlotData = [...(plotData || [])].sort((a, b) => b.score - a.score);
	$: normalizedListSearch = listSearchTerm.trim().toLowerCase();
	$: filteredListItems = normalizedListSearch
			? sortedPlotData.filter(item => matchesListSearch(item, normalizedListSearch))
			: sortedPlotData;
	$: visibleListItems = normalizedListSearch ? filteredListItems : [];
	$: selectedItem = plotData.find(item => item.id === selectedItemId) || null;
	$: selectedItemSpecs = extractDetailSpecs(selectedItem);
	$: if (selectedItemId && !(plotData || []).some(item => item.id === selectedItemId)) {
		selectedItemId = null;
	}

	function getNibMaterialColor(nibMaterial: string): string {
		if (!nibMaterial) return 'transparent'; // Empty/outlined for unknown
		
		const material = nibMaterial.toLowerCase();
		
		if (material.includes('steel')) {
			return '#9ca3af'; // light gray
		} else if (material.includes('titanium')) {
			return '#4b5563'; // dark gray  
		} else if (material.includes('gold')) {
			return '#fbbf24'; // gold (covers 14k, 18k, 21k, etc.)
		} else if (material.includes('palladium')) {
			return '#d1d5db'; // lighter gray for palladium
		} else {
			return 'transparent'; // Empty/outlined for unmatched materials
		}
	}

	// Force re-render when plotData changes
	$: if (svgElement && plotData) {
		renderPlot();
	}

	// Update highlighting separately to avoid full re-render
	$: if (svgElement && highlightedItem !== undefined) {
		updateHighlighting();
	}

	function matchesListSearch(item: PlotItem, normalizedTerm: string): boolean {
		if (!normalizedTerm) return true;
		const searchableStrings: string[] = [
			item.name,
			item.description || '',
			String(item.cost),
			item.specs?.nib_material || ''
		];

		Object.values(item.specs || {}).forEach(value => {
			if (value === null) return;
			if (Array.isArray(value)) {
				searchableStrings.push(value.join(' '));
			} else {
				searchableStrings.push(String(value));
			}
		});

		return searchableStrings.some(text => text.toLowerCase().includes(normalizedTerm));
	}

	function formatSpecValue(value: unknown): string {
		if (value === null || value === undefined) return 'N/A';
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		return String(value).replace(/_/g, ' ');
	}

	function focusItem(itemId: string) {
		selectedItemId = itemId;
	}

	function extractDetailSpecs(item: PlotItem | null): SpecEntry[] {
		if (!item) return [];
		return Object.entries(item.specs || {})
			.filter(([, value]) => value !== null)
			.slice(0, 6) as SpecEntry[];
	}

	function updateHighlighting() {
		if (!svgElement) return;
		const svg = d3.select(svgElement);
		svg.selectAll('.point')
			.attr('r', (d: any) => d.id === highlightedItem ? 8 : 5)
			.attr('fill', (d: any) => {
				if (d.id === highlightedItem) return '#3b82f6';
				const color = getNibMaterialColor(d.specs.nib_material);
				return color === 'transparent' ? 'none' : color;
			})
			.attr('stroke', (d: any) => {
				if (d.id === highlightedItem) return '#fff';
				const color = getNibMaterialColor(d.specs.nib_material);
				return color === 'transparent' ? '#6b7280' : '#fff';
			});
	}

	function renderPlot() {
		const svg = d3.select(svgElement);
		svg.selectAll('*').remove();

		const margin = { top: 20, right: 30, bottom: 50, left: 60 };
		const width = svgWidth - margin.left - margin.right;
		const height = svgHeight - margin.top - margin.bottom;

		const g = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Scales with padding to ensure points aren't clipped
		const xExtent = d3.extent(plotData, d => d.cost) as [number, number];
		const yExtent = d3.extent(plotData, d => d.score) as [number, number];
		
		const xScale = d3.scaleLinear()
			.domain(xExtent)
			.range([10, width - 10])  // Add 10px padding on each side
			.nice();

		const yScale = d3.scaleLinear()
			.domain(yExtent)
			.range([height - 10, 10])  // Add 10px padding on top and bottom
			.nice();

		// Create axis scales without padding for proper axis positioning
		const xAxisScale = d3.scaleLinear()
			.domain(xExtent)
			.range([0, width])
			.nice();

		const yAxisScale = d3.scaleLinear()
			.domain(yExtent)
			.range([height, 0])
			.nice();

		// Axes
		g.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(xAxisScale))
			.append('text')
			.attr('x', width / 2)
			.attr('y', 35)
			.attr('fill', 'black')
			.style('text-anchor', 'middle')
			.text('Cost ($)');

		g.append('g')
			.call(d3.axisLeft(yAxisScale))
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -40)
			.attr('x', -height / 2)
			.attr('fill', 'black')
			.style('text-anchor', 'middle')
			.text('Score');

		// Legend for nib materials
		const legend = g.append('g')
			.attr('class', 'legend')
			.attr('transform', `translate(${width - 120}, ${height - 80})`);

		const nibMaterials = [
			{ material: 'steel', label: 'Steel', color: getNibMaterialColor('steel'), outlined: false },
			{ material: 'titanium', label: 'Titanium', color: getNibMaterialColor('titanium'), outlined: false },
			{ material: '14k_gold', label: 'Gold', color: getNibMaterialColor('14k_gold'), outlined: false },
			{ material: 'palladium', label: 'Palladium', color: getNibMaterialColor('palladium'), outlined: false },
			{ material: 'unknown', label: 'Other/Unknown', color: '#6b7280', outlined: true }
		];

		nibMaterials.forEach((item, i) => {
			const legendRow = legend.append('g')
				.attr('transform', `translate(0, ${i * 18})`);

			legendRow.append('circle')
				.attr('cx', 6)
				.attr('cy', 0)
				.attr('r', 5)
				.attr('fill', item.outlined ? 'none' : item.color)
				.attr('stroke', item.outlined ? item.color : '#fff')
				.attr('stroke-width', item.outlined ? 2 : 1);

			legendRow.append('text')
				.attr('x', 18)
				.attr('y', 0)
				.attr('dy', '0.35em')
				.style('font-size', '11px')
				.style('fill', '#4b5563')
				.text(item.label);
		});

		// Points
		g.selectAll('.point')
			.data(plotData)
			.enter()
			.append('circle')
			.attr('class', 'point')
			.attr('cx', d => xScale(d.cost))
			.attr('cy', d => yScale(d.score))
			.attr('r', d => d.id === highlightedItem ? 8 : 5)
			.attr('fill', d => {
				if (d.id === highlightedItem) return '#3b82f6';
				const color = getNibMaterialColor(d.specs.nib_material);
				return color === 'transparent' ? 'none' : color;
			})
			.attr('stroke', d => {
				const color = getNibMaterialColor(d.specs.nib_material);
				return color === 'transparent' ? '#6b7280' : '#fff';
			})
			.attr('stroke-width', d => {
				const color = getNibMaterialColor(d.specs.nib_material);
				return color === 'transparent' ? 2 : 2;
			})
			.style('cursor', 'pointer')
			.on('mouseover', function(event, d) {
				d3.select(this).attr('r', 8).attr('fill', '#3b82f6');
				showTooltip(event, d);
				onItemHover(d);
			})
			.on('mouseout', function(event, d) {
				if (d.id !== highlightedItem) {
					const color = getNibMaterialColor(d.specs.nib_material);
					d3.select(this)
						.attr('r', 5)
						.attr('fill', color === 'transparent' ? 'none' : color)
						.attr('stroke', color === 'transparent' ? '#6b7280' : '#fff');
				}
				hideTooltip();
				onItemHover(null);
			})
			.on('click', function(event, d) {
				// Expand the accordion for this item
				expandedItems.add(d.id);
				expandedItems = expandedItems;
				focusItem(d.id);
				
				// Briefly highlight the item being navigated to
				onItemHover(d);
			});
	}

	function showTooltip(event: MouseEvent, item: Item & { score: number }) {
		if (tooltip && svgElement) {
			const svgRect = svgElement.getBoundingClientRect();
			const relativeX = event.clientX - svgRect.left;
			const relativeY = event.clientY - svgRect.top;
			
			tooltip.style.opacity = '1';
			tooltip.style.display = 'block';
			
			// Set content first to measure tooltip dimensions
			tooltip.innerHTML = `
				<div class="font-semibold">${item.name}</div>
				<div class="text-sm text-gray-600">Cost: $${item.cost}</div>
				<div class="text-sm text-gray-600">Score: ${item.score.toFixed(1)}</div>
				<div class="text-xs text-gray-500 mt-1">Click to view details below</div>
			`;
			
			// Check if tooltip would overflow the right edge
			const tooltipRect = tooltip.getBoundingClientRect();
			const tooltipWidth = tooltipRect.width;
			const svgWidth = svgRect.width;
			
			// Position tooltip - flip to left if would overflow
			const leftPosition = (relativeX + 15 + tooltipWidth > svgWidth) 
				? relativeX - tooltipWidth - 15  // Left of cursor
				: relativeX + 15;                // Right of cursor
			
			tooltip.style.left = leftPosition + 'px';
			tooltip.style.top = (relativeY - 10) + 'px';
		}
	}

	function hideTooltip() {
		if (tooltip) {
			tooltip.style.opacity = '0';
			tooltip.style.display = 'none';
		}
	}

	function toggleExpand(itemId: string) {
		if (expandedItems.has(itemId)) {
			expandedItems.delete(itemId);
		} else {
			expandedItems.add(itemId);
		}
		expandedItems = expandedItems;
	}

	function handleListItemClick(itemId: string) {
		focusItem(itemId);
		toggleExpand(itemId);
	}

	function handleListItemKeydown(event: KeyboardEvent, itemId: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleListItemClick(itemId);
		}
	}

	function focusQuickFindInput() {
		const input = document.getElementById(QUICK_FIND_INPUT_ID) as HTMLInputElement | null;
		input?.focus();
	}

	onMount(() => {
		updateDimensions();
		renderPlot();
		
		// Set up resize observer for responsive behavior
		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
			renderPlot();
		});
		
		if (containerElement) {
			resizeObserver.observe(containerElement);
		}
		
		// Cleanup
		return () => {
			resizeObserver.disconnect();
		};
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Nerd Out</h2>
		<div class="text-sm text-gray-600">
			{plotData?.length || 0} pens • Interactive plot and list
		</div>
	</div>
	
	<!-- Plot Section -->
	<div class="grid gap-6 lg:grid-cols-3">
		<div class="relative lg:col-span-2">
			<div bind:this={containerElement} class="w-full">
				<svg 
					bind:this={svgElement}
					width={svgWidth} 
					height={svgHeight}
					viewBox="0 0 {svgWidth} {svgHeight}"
					class="border border-gray-300 rounded w-full h-auto max-w-full"
					style="overflow: visible;"
				></svg>
			</div>
			
			<div 
				bind:this={tooltip}
				class="absolute pointer-events-none opacity-0 bg-white border border-gray-300 rounded shadow-lg p-3 text-sm transition-opacity duration-200 z-50 max-w-xs"
				style="display: none;"
			></div>
		</div>

		<div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-full">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-semibold">Selected Fountain Pen</h3>
				{#if selectedItem}
					<span class="text-sm text-gray-600 font-medium">
						Score {selectedItem.score.toFixed(1)}
					</span>
				{/if}
			</div>

			{#if selectedItem}
				<div class="mt-3 flex flex-col gap-4 text-sm text-gray-700">
					<div>
						<div class="text-xl font-bold text-gray-900">{selectedItem.name}</div>
						<div class="text-sm text-gray-500 mt-1">
							Cost ${selectedItem.cost} • {selectedItem.specs.nib_material?.replace(/_/g, ' ') || 'Nib material unknown'}
						</div>
					</div>

					{#if selectedItem.description}
						<p class="text-gray-600">{selectedItem.description}</p>
					{/if}

					<div class="grid grid-cols-2 gap-3">
						<div class="rounded border border-gray-200 p-2 bg-gray-50">
							<div class="text-xs uppercase text-gray-500">Cost</div>
							<div class="text-lg font-semibold text-gray-900">${selectedItem.cost}</div>
						</div>
						<div class="rounded border border-gray-200 p-2 bg-gray-50">
							<div class="text-xs uppercase text-gray-500">Score</div>
							<div class="text-lg font-semibold text-gray-900">{selectedItem.score.toFixed(1)}</div>
						</div>
					</div>

					<div>
						<h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
							Key specs
						</h4>
						{#if selectedItemSpecs.length === 0}
							<p class="text-gray-500 text-sm">No specs available for this pen.</p>
						{:else}
							<div class="space-y-1 text-sm">
								{#each selectedItemSpecs as [key, value]}
									<div class="flex justify-between gap-3">
										<span class="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
										<span class="font-medium text-gray-900 text-right">{formatSpecValue(value)}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					{#if selectedItem.url}
						<a 
							href={selectedItem.url} 
							target="_blank" 
							rel="noopener noreferrer"
							class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
						>
							View product page →
						</a>
					{/if}
				</div>
			{:else}
				<p class="text-sm text-gray-600 mt-3">
					Click any dot in the plot or a pen in the list to spotlight its specs here without scrolling the full catalog.
				</p>
			{/if}
		</div>
	</div>

	<!-- Pen List Section -->
	{#if plotData && plotData.length > 0}
		<div class="mt-8">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h3 class="text-lg font-semibold">Search Fountain Pens</h3>
						{#if normalizedListSearch}
							<p class="text-sm text-gray-500">
								{visibleListItems.length} match{visibleListItems.length === 1 ? '' : 'es'} for "{listSearchTerm}"
							</p>
						{:else}
							<p class="text-sm text-gray-500">
								Enter a quick find query to reveal pens from the full catalog.
							</p>
						{/if}
					</div>

				<div class="w-full sm:w-80">
					<label
						for={QUICK_FIND_INPUT_ID}
						class="block text-xs uppercase tracking-wide text-gray-500 mb-1"
					>
						Quick find
					</label>
					<input
						id={QUICK_FIND_INPUT_ID}
						type="text"
						placeholder="Start typing a pen name, nib, or spec..."
						bind:value={listSearchTerm}
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
					/>
				</div>
			</div>

			{#if !normalizedListSearch}
				<div class="mt-4 border border-dashed border-gray-300 rounded-lg bg-white p-4 shadow-sm">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<p class="font-semibold text-gray-900">
								Start typing to explore the catalog
							</p>
							<p class="text-sm text-gray-600">
								Use the quick find input above to filter hundreds of pens by name, nib material, filling system, or any other spec.
							</p>
						</div>
						<div class="text-3xl sm:text-4xl text-blue-500 sm:self-start" aria-hidden="true">↑</div>
					</div>
					<button
						on:click={focusQuickFindInput}
						type="button"
						class="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
					>
						Jump to quick find field
					</button>
				</div>
			{:else if visibleListItems.length === 0}
				<p class="mt-4 text-sm text-gray-600">
					No pens match "{listSearchTerm}". Try a different name, nib material, or spec keyword.
				</p>
			{:else}
			<div class="space-y-2 mt-4">
				{#each visibleListItems as item (item.id)}
				{@const isHighlighted = highlightedItem === item.id}
				{@const isExpanded = expandedItems.has(item.id)}
				<div 
					id="pen-{item.id}"
					class="border border-gray-200 rounded-lg transition-all duration-300 {isHighlighted ? 'ring-2 ring-blue-500 bg-blue-50' : ''} {isExpanded ? 'shadow-lg' : 'shadow-sm'}"
				>
					<!-- Main pen info - clickable to expand -->
					<div 
						class="p-4 cursor-pointer hover:bg-gray-50"
						role="button"
						tabindex="0"
						on:mouseenter={() => onItemHover(item)}
						on:mouseleave={() => onItemHover(null)}
						on:click={() => handleListItemClick(item.id)}
						on:keydown={(event) => handleListItemKeydown(event, item.id)}
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<div class="font-semibold text-lg">{item.name}</div>
								<div class="text-sm text-gray-600 mt-1">
									Score: {item.score.toFixed(1)} • Cost: ${item.cost}
								</div>
								{#if item.description}
									<div class="text-sm text-gray-500 mt-1">{item.description}</div>
								{/if}
							</div>
							
							<!-- Nib Material Badge -->
							<div class="ml-4">
								<span 
									class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
									style="background-color: {getNibMaterialColor(item.specs.nib_material)}"
								>
									{item.specs.nib_material?.replace('_', ' ') || 'Unknown'}
								</span>
							</div>
							
							<!-- Expand/External Link Icons -->
							<div class="flex items-center ml-2 space-x-2">
								<!-- Expand Arrow -->
								<svg 
									class="w-5 h-5 text-gray-400 transform transition-transform duration-300 ease-out {isExpanded ? 'rotate-180' : ''}"
									fill="currentColor" 
									viewBox="0 0 20 20"
								>
									<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
								</svg>
								
								<!-- External Link Icon -->
								{#if item.url}
									<button
										on:click|stopPropagation={() => window.open(item.url, '_blank')}
										class="text-gray-400 hover:text-blue-600 transition-colors"
										title="Open product page in new tab"
									>
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
											<path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z"></path>
										</svg>
									</button>
								{/if}
							</div>
						</div>
					</div>

					<!-- Expandable specifications section -->
					{#if isExpanded}
						<div 
							class="border-t border-gray-200 p-4 bg-gray-50"
							transition:slide={{ duration: 400, easing: quintOut }}
						>
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
			{/if}
		</div>
	{/if}
</div>
