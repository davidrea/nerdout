import type { Item, FilterRule } from './types';

export function applyFilters(items: Item[], filters: FilterRule[]): Item[] {
	return items.filter(item => {
		return filters.every(filter => {
			const value = item.specs[filter.attribute];
			
			switch (filter.operator) {
				case 'equals':
					return value === filter.value;
				case 'greater':
					return typeof value === 'number' && value > filter.value;
				case 'less':
					return typeof value === 'number' && value < filter.value;
				case 'contains':
					return typeof value === 'string' && value.toLowerCase().includes(filter.value.toLowerCase());
				case 'in':
					return Array.isArray(filter.value) && filter.value.includes(value);
				case 'has':
					// For when the item attribute is an array and we want to check if it contains the filter value
					return Array.isArray(value) && value.includes(filter.value);
				case 'has_any':
					// For when both filter value and item value are arrays, check if they have any overlap
					return Array.isArray(value) && Array.isArray(filter.value) && 
						   filter.value.some(filterVal => value.includes(filterVal));
				default:
					return true;
			}
		});
	});
}

export function searchItems(items: Item[], searchTerm: string): Item[] {
	if (!searchTerm.trim()) return items;
	
	const term = searchTerm.toLowerCase();
	return items.filter(item => 
		item.name.toLowerCase().includes(term) ||
		item.description?.toLowerCase().includes(term) ||
		Object.values(item.specs).some(value => 
			typeof value === 'string' && value.toLowerCase().includes(term)
		)
	);
}