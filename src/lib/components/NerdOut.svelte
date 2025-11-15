<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Item, Criterion } from '../types';
	import { calculateItemScore } from '../scoring';

	export let items: Item[] = [];
	export let criteria: Criterion[] = [];
	export let highlightedItem: string | null = null;
	export let onItemHover: (item: Item | null) => void = () => {};
	export let onItemClick: (item: Item) => void = () => {};
	export let compact = false;

	let svgElement: SVGSVGElement;
	let tooltip: HTMLDivElement;
	let containerElement: HTMLDivElement;
	
	// Responsive dimensions
	let containerWidth = 800;
	let containerHeight = 500;
	
	$: svgWidth = compact ? Math.min(containerWidth, 400) : containerWidth;
	$: svgHeight = compact ? Math.min(containerHeight, 300) : Math.max(containerWidth * 0.6, 400);
	
	// Observe container size changes
	function updateDimensions() {
		if (containerElement) {
			const rect = containerElement.getBoundingClientRect();
			containerWidth = Math.max(rect.width || 400, 300); // Minimum 300px
			containerHeight = compact ? 300 : Math.max(containerWidth * 0.6, 400);
		}
	}

	$: plotData = items.map(item => ({
		...item,
		score: calculateItemScore(item, criteria)
	}));

	function getNibMaterialColor(nibMaterial: string): string {
		switch (nibMaterial) {
			case 'steel': return '#9ca3af'; // light gray
			case 'titanium': return '#4b5563'; // dark gray  
			case '14k gold':
			case '18k gold':
			case 'gold': return '#fbbf24'; // gold
			default: return '#6b7280'; // default gray
		}
	}

	// Force re-render when plotData or compact mode changes
	$: if (svgElement && plotData) {
		renderPlot();
	}
	
	// Force re-render when compact mode changes
	$: if (svgElement && compact !== undefined) {
		renderPlot();
	}

	// Update highlighting separately to avoid full re-render
	$: if (svgElement && highlightedItem !== undefined) {
		updateHighlighting();
	}

	function updateHighlighting() {
		if (!svgElement) return;
		const svg = d3.select(svgElement);
		svg.selectAll('.point')
			.attr('r', (d: any) => d.id === highlightedItem ? 8 : 5)
			.attr('fill', (d: any) => d.id === highlightedItem ? '#3b82f6' : getNibMaterialColor(d.specs.nib_material));
	}

	function renderPlot() {
		const svg = d3.select(svgElement);
		svg.selectAll('*').remove();

		const margin = compact 
			? { top: 20, right: 30, bottom: 45, left: 55 }  // Adequate margins for compact mode
			: { top: 20, right: 30, bottom: 50, left: 60 };
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
			.attr('y', compact ? 30 : 35)  // Smaller Y offset for compact mode
			.attr('fill', 'black')
			.style('text-anchor', 'middle')
			.text('Cost ($)');

		g.append('g')
			.call(d3.axisLeft(yAxisScale))
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', compact ? -35 : -40)  // Smaller Y offset for compact mode
			.attr('x', -height / 2)
			.attr('fill', 'black')
			.style('text-anchor', 'middle')
			.text('Score');

		// Legend for nib materials
		const legend = g.append('g')
			.attr('class', 'legend')
			.attr('transform', `translate(${width - 120}, ${height - 80})`);

		const nibMaterials = [
			{ material: 'steel', label: 'Steel', color: getNibMaterialColor('steel') },
			{ material: 'titanium', label: 'Titanium', color: getNibMaterialColor('titanium') },
			{ material: '14k gold', label: 'Gold', color: getNibMaterialColor('14k gold') }
		];

		nibMaterials.forEach((item, i) => {
			const legendRow = legend.append('g')
				.attr('transform', `translate(0, ${i * 18})`);

			legendRow.append('circle')
				.attr('cx', 6)
				.attr('cy', 0)
				.attr('r', 5)
				.attr('fill', item.color)
				.attr('stroke', '#fff')
				.attr('stroke-width', 1);

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
			.attr('fill', d => d.id === highlightedItem ? '#3b82f6' : getNibMaterialColor(d.specs.nib_material))
			.attr('stroke', '#fff')
			.attr('stroke-width', 2)
			.style('cursor', 'pointer')
			.on('mouseover', function(event, d) {
				d3.select(this).attr('r', 8).attr('fill', '#3b82f6');
				showTooltip(event, d);
				onItemHover(d);
			})
			.on('mouseout', function(event, d) {
				if (d.id !== highlightedItem) {
					d3.select(this).attr('r', 5).attr('fill', getNibMaterialColor(d.specs.nib_material));
				}
				hideTooltip();
				onItemHover(null);
			})
			.on('click', function(event, d) {
				onItemClick(d);
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
				${item.url ? `<div class="text-xs text-gray-500 mt-1">Click the dot for more info</div>` : ''}
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

<div class="relative">
	<h2 class="text-2xl font-bold mb-4">{compact ? 'Nerd Out (Plot)' : 'Nerd Out'}</h2>
	
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