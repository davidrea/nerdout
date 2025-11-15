<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let min: number = 0;
	export let max: number = 100;
	export let minValue: number = min;
	export let maxValue: number = max;
	export let step: number = 1;
	export let label: string = 'Range';

	const dispatch = createEventDispatcher();

	let sliderElement: HTMLDivElement;
	let isDraggingMin = false;
	let isDraggingMax = false;

	// Ensure values stay within bounds and min doesn't exceed max
	$: {
		if (minValue < min) minValue = min;
		if (maxValue > max) maxValue = max;
		if (minValue > maxValue) minValue = maxValue;
	}

	function handleMinChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseFloat(target.value);
		if (value <= maxValue) {
			minValue = value;
			dispatch('change', { min: minValue, max: maxValue });
		}
	}

	function handleMaxChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseFloat(target.value);
		if (value >= minValue) {
			maxValue = value;
			dispatch('change', { min: minValue, max: maxValue });
		}
	}

	function handleMinInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseFloat(target.value);
		if (value <= maxValue) {
			minValue = value;
		}
	}

	function handleMaxInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseFloat(target.value);
		if (value >= minValue) {
			maxValue = value;
		}
	}

	// Calculate percentages for visual representation
	$: minPercent = ((minValue - min) / (max - min)) * 100;
	$: maxPercent = ((maxValue - min) / (max - min)) * 100;
</script>

<div class="range-slider-container">
	<div class="flex items-center justify-between mb-2">
		<label class="block text-sm font-medium text-gray-700">
			{label}
		</label>
		<div class="text-sm text-gray-600">
			${minValue.toFixed(0)} - ${maxValue.toFixed(0)}
		</div>
	</div>

	<div class="relative" bind:this={sliderElement}>
		<!-- Track background -->
		<div class="h-2 bg-gray-200 rounded-full absolute w-full top-3"></div>

		<!-- Active track (between thumbs) -->
		<div
			class="h-2 bg-blue-600 rounded-full absolute top-3"
			style="left: {minPercent}%; right: {100 - maxPercent}%"
		></div>

		<!-- Min slider -->
		<input
			type="range"
			{min}
			{max}
			{step}
			value={minValue}
			on:input={handleMinInput}
			on:change={handleMinChange}
			on:mousedown={() => isDraggingMin = true}
			on:mouseup={() => isDraggingMin = false}
			on:touchstart={() => isDraggingMin = true}
			on:touchend={() => isDraggingMin = false}
			class="range-input range-input-min"
			style="z-index: {isDraggingMin ? 5 : minValue > max - (max - min) * 0.05 ? 4 : 3}"
		/>

		<!-- Max slider -->
		<input
			type="range"
			{min}
			{max}
			{step}
			value={maxValue}
			on:input={handleMaxInput}
			on:change={handleMaxChange}
			on:mousedown={() => isDraggingMax = true}
			on:mouseup={() => isDraggingMax = false}
			on:touchstart={() => isDraggingMax = true}
			on:touchend={() => isDraggingMax = false}
			class="range-input range-input-max"
			style="z-index: {isDraggingMax ? 5 : 3}"
		/>
	</div>

	<!-- Optional: Manual input fields -->
	<div class="grid grid-cols-2 gap-3 mt-4">
		<div>
			<label class="block text-xs text-gray-600 mb-1">Min</label>
			<input
				type="number"
				{min}
				{max}
				{step}
				value={minValue}
				on:input={(e) => {
					const value = parseFloat(e.currentTarget.value);
					if (!isNaN(value) && value <= maxValue) {
						minValue = value;
						dispatch('change', { min: minValue, max: maxValue });
					}
				}}
				class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
			/>
		</div>
		<div>
			<label class="block text-xs text-gray-600 mb-1">Max</label>
			<input
				type="number"
				{min}
				{max}
				{step}
				value={maxValue}
				on:input={(e) => {
					const value = parseFloat(e.currentTarget.value);
					if (!isNaN(value) && value >= minValue) {
						maxValue = value;
						dispatch('change', { min: minValue, max: maxValue });
					}
				}}
				class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
			/>
		</div>
	</div>
</div>

<style>
	.range-slider-container {
		padding: 0.5rem 0;
	}

	.range-input {
		position: absolute;
		width: 100%;
		height: 2rem;
		top: 0;
		left: 0;
		pointer-events: none;
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		outline: none;
	}

	/* Webkit (Chrome, Safari, Edge) */
	.range-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		pointer-events: all;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: white;
		border: 2px solid #3b82f6;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: all 0.15s ease-in-out;
	}

	.range-input::-webkit-slider-thumb:hover {
		border-width: 3px;
		box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
	}

	.range-input::-webkit-slider-thumb:active {
		border-width: 3px;
		background: #3b82f6;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.6);
	}

	/* Firefox */
	.range-input::-moz-range-thumb {
		pointer-events: all;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: white;
		border: 2px solid #3b82f6;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: all 0.15s ease-in-out;
	}

	.range-input::-moz-range-thumb:hover {
		border-width: 3px;
		box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
	}

	.range-input::-moz-range-thumb:active {
		border-width: 3px;
		background: #3b82f6;
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.6);
	}

	/* Remove track styling */
	.range-input::-webkit-slider-runnable-track {
		background: transparent;
	}

	.range-input::-moz-range-track {
		background: transparent;
	}
</style>
