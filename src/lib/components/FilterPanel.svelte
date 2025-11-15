<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Item, FilterRule } from '../types';
	import RangeSlider from './RangeSlider.svelte';

	export let items: Item[] = [];
	export let filters: FilterRule[] = [];
	export let searchTerm: string = '';
	export let priceMin: number = 0;
	export let priceMax: number = 10000;
	export let selectedPriceMin: number = 0;
	export let selectedPriceMax: number = 10000;

	const dispatch = createEventDispatcher();

	let availableAttributes: Set<string> = new Set();
	let attributeValues: Record<string, Set<any>> = {};
	let isExpanded = false;

	// Extract available specs and their possible values
	$: {
		availableAttributes = new Set();
		attributeValues = {};
		
		items.forEach(item => {
			Object.entries(item.specs).forEach(([key, value]) => {
				if (value !== null) { // Skip null values
					availableAttributes.add(key);
					if (!attributeValues[key]) {
						attributeValues[key] = new Set();
					}
					
					// Handle both single values and arrays
					if (Array.isArray(value)) {
						value.forEach(v => attributeValues[key].add(v));
					} else {
						attributeValues[key].add(value);
					}
				}
			});
		});
	}

	function addFilter() {
		const newFilter: FilterRule = {
			attribute: Array.from(availableAttributes)[0] || '',
			operator: 'equals',
			value: ''
		};
		dispatch('filtersChange', [...filters, newFilter]);
	}

	function updateFilter(index: number, updates: Partial<FilterRule>) {
		const updatedFilters = filters.map((filter, i) => 
			i === index ? { ...filter, ...updates } : filter
		);
		dispatch('filtersChange', updatedFilters);
	}

	function removeFilter(index: number) {
		const updatedFilters = filters.filter((_, i) => i !== index);
		dispatch('filtersChange', updatedFilters);
	}

	function clearAllFilters() {
		dispatch('filtersChange', []);
		dispatch('searchChange', '');
		dispatch('priceRangeChange', { min: priceMin, max: priceMax });
	}

	function handlePriceRangeChange(event: CustomEvent<{ min: number, max: number }>) {
		dispatch('priceRangeChange', event.detail);
	}

	function onSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		dispatch('searchChange', target.value);
	}

	function getAttributeValueOptions(attribute: string): any[] {
		return Array.from(attributeValues[attribute] || []).sort();
	}

	function getOperatorLabel(operator: string): string {
		switch (operator) {
			case 'equals': return 'equals';
			case 'greater': return 'greater than';
			case 'less': return 'less than';
			case 'contains': return 'contains';
			case 'in': return 'is one of';
			case 'has': return 'has';
			case 'has_any': return 'has any of';
			default: return operator;
		}
	}

	function isArrayAttribute(attribute: string): boolean {
		// Check if this attribute contains array values in any item
		return items.some(item => Array.isArray(item.specs[attribute]));
	}

	function getAvailableOperators(attribute: string): string[] {
		if (isArrayAttribute(attribute)) {
			return ['has', 'has_any'];
		}

		// Check if numeric
		const isNumeric = Array.from(attributeValues[attribute] || []).every(v =>
			typeof v === 'number' || !isNaN(Number(v))
		);

		if (isNumeric) {
			return ['equals', 'greater', 'less'];
		}

		return ['equals', 'contains', 'in'];
	}

	// Check if price range filter is active
	$: isPriceRangeActive = selectedPriceMin > priceMin || selectedPriceMax < priceMax;
</script>

<div class="bg-parchment-50 border-2 border-ink-200 rounded-lg">
	<!-- Collapsible header -->
	<div class="p-4 flex items-center justify-between hover:bg-parchment-100 rounded-t-lg transition-colors">
		<button
			on:click={() => isExpanded = !isExpanded}
			class="flex-1 flex items-center space-x-2 text-left"
		>
			<h3 class="text-lg font-semibold font-serif text-ink-900">Filter & Search</h3>
			{#if filters.length > 0 || searchTerm || isPriceRangeActive}
				<span class="px-2 py-1 bg-brass-100 text-brass-900 text-xs rounded-full font-medium">
					{filters.length + (searchTerm ? 1 : 0) + (isPriceRangeActive ? 1 : 0)} active
				</span>
			{/if}
		</button>
		<div class="flex items-center space-x-2">
			{#if filters.length > 0 || searchTerm || isPriceRangeActive}
				<button
					on:click={clearAllFilters}
					class="text-sm text-burgundy-700 hover:text-burgundy-900 px-2 py-1 rounded transition-colors"
				>
					Clear All
				</button>
			{/if}
			<button
				on:click={() => isExpanded = !isExpanded}
				class="p-1"
				aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
			>
				<svg
					class="w-5 h-5 text-charcoal-lighter transform transition-transform {isExpanded ? 'rotate-180' : ''}"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
				</svg>
			</button>
		</div>
	</div>

	<!-- Collapsible content -->
	{#if isExpanded}
		<div class="space-y-4 p-4 pt-0">

	<!-- Search -->
	<div>
		<label class="block text-sm font-medium text-charcoal mb-2">
			Search Items
		</label>
		<input
			type="text"
			placeholder="Search by name, description, or attributes..."
			value={searchTerm}
			on:input={onSearchInput}
			class="w-full px-3 py-2 border-2 border-ink-200 rounded-md focus:ring-2 focus:ring-brass-500 focus:border-brass-600 bg-parchment-50"
		/>
	</div>

	<!-- Price Range Filter -->
	<div>
		<RangeSlider
			label="Price Range"
			min={priceMin}
			max={priceMax}
			minValue={selectedPriceMin}
			maxValue={selectedPriceMax}
			step={1}
			on:change={handlePriceRangeChange}
		/>
	</div>

	<!-- Filters -->
	<div>
		<div class="flex items-center justify-between mb-2">
			<label class="block text-sm font-medium text-charcoal">
				Filters
			</label>
			<button
				on:click={addFilter}
				class="text-sm bg-ink-700 text-parchment-50 px-3 py-1 rounded hover:bg-brass-600 transition-colors"
				disabled={availableAttributes.size === 0}
			>
				+ Add Filter
			</button>
		</div>

		{#if filters.length === 0}
			<p class="text-sm text-charcoal-lighter italic">No filters applied</p>
		{:else}
			<div class="space-y-3">
				{#each filters as filter, index}
					<div class="flex items-center space-x-2 p-3 bg-parchment-100 border-2 border-ink-100 rounded-lg">
						<!-- Attribute selector -->
						<select
							value={filter.attribute}
							on:change={(e) => updateFilter(index, { attribute: e.currentTarget.value, value: '' })}
							class="px-2 py-1 border-2 border-ink-200 rounded text-sm bg-parchment-50"
						>
							{#each Array.from(availableAttributes) as attr}
								<option value={attr}>{attr.replace(/_/g, ' ')}</option>
							{/each}
						</select>

						<!-- Operator selector -->
						<select
							value={filter.operator}
							on:change={(e) => updateFilter(index, { operator: e.currentTarget.value as FilterRule['operator'], value: '' })}
							class="px-2 py-1 border-2 border-ink-200 rounded text-sm bg-parchment-50"
						>
							{#each getAvailableOperators(filter.attribute) as operator}
								<option value={operator}>{getOperatorLabel(operator)}</option>
							{/each}
						</select>

						<!-- Value input -->
						{#if filter.operator === 'in' || filter.operator === 'has_any'}
							<select
								multiple
								value={Array.isArray(filter.value) ? filter.value : [filter.value]}
								on:change={(e) => {
									const selected = Array.from(e.currentTarget.selectedOptions).map(o => o.value);
									updateFilter(index, { value: selected });
								}}
								class="px-2 py-1 border-2 border-ink-200 rounded text-sm min-w-32 bg-parchment-50"
								size="3"
							>
								{#each getAttributeValueOptions(filter.attribute) as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						{:else if filter.operator === 'equals' || filter.operator === 'has'}
							<select
								value={filter.value}
								on:change={(e) => updateFilter(index, { value: e.currentTarget.value })}
								class="px-2 py-1 border-2 border-ink-200 rounded text-sm bg-parchment-50"
							>
								<option value="">Select value...</option>
								{#each getAttributeValueOptions(filter.attribute) as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
						{:else if filter.operator === 'greater' || filter.operator === 'less'}
							<input
								type="number"
								value={filter.value}
								on:input={(e) => updateFilter(index, { value: parseFloat(e.currentTarget.value) || 0 })}
								placeholder="Enter number..."
								class="px-2 py-1 border-2 border-ink-200 rounded text-sm w-32 bg-parchment-50"
							/>
						{:else}
							<input
								type="text"
								value={filter.value}
								on:input={(e) => updateFilter(index, { value: e.currentTarget.value })}
								placeholder="Enter value..."
								class="px-2 py-1 border-2 border-ink-200 rounded text-sm bg-parchment-50"
							/>
						{/if}

						<!-- Remove filter -->
						<button
							on:click={() => removeFilter(index)}
							class="p-1 text-burgundy-600 hover:bg-burgundy-100 rounded transition-colors"
							title="Remove filter"
						>
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
							</svg>
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Quick filters for common attributes -->
	{#if availableAttributes.size > 0}
		<div>
			<label class="block text-sm font-medium text-charcoal mb-2">
				Quick Filters
			</label>
			<div class="flex flex-wrap gap-2">
				{#each Array.from(availableAttributes).slice(0, 6) as attribute}
					{@const commonValues = getAttributeValueOptions(attribute).slice(0, 4)}
					{#each commonValues as value}
						{@const isActive = filters.some(f => f.attribute === attribute && f.operator === 'equals' && f.value === value)}
						<button
							on:click={() => {
								if (isActive) {
									const filterIndex = filters.findIndex(f => f.attribute === attribute && f.operator === 'equals' && f.value === value);
									if (filterIndex >= 0) removeFilter(filterIndex);
								} else {
									const newFilter: FilterRule = { attribute, operator: 'equals', value };
									dispatch('filtersChange', [...filters, newFilter]);
								}
							}}
							class="px-2 py-1 text-xs rounded-md border-2 transition-colors {isActive ? 'bg-brass-600 text-parchment-50 border-brass-600' : 'bg-parchment-50 text-charcoal border-ink-200 hover:bg-parchment-100'}"
						>
							{attribute.replace(/_/g, ' ')}: {value}
						</button>
					{/each}
				{/each}
			</div>
		</div>
	{/if}
	</div>
	{/if}
</div>