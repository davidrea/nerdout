# Nerdout - Fountain Pen Comparison Tool

## Project Overview

**Nerdout** is a single-page web application inspired by 99spokes' bike comparison tool, designed to help users compare and analyze items across multiple criteria using data visualization and objective scoring. The initial implementation focuses on fountain pen comparison but the framework is extensible to other product categories.

### Technology Stack
- **Frontend**: SvelteKit with TypeScript
- **Styling**: TailwindCSS  
- **Visualization**: D3.js for interactive scatter plots
- **Build Tool**: Vite
- **Package Manager**: npm

## Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── FilterPanel.svelte       # Collapsible filtering interface
│   │   ├── NerdOut.svelte          # 2D cost vs score scatter plot
│   │   ├── NerdWayOut.svelte       # Expandable item list
│   │   ├── NerdWayWayOut.svelte    # Criteria management & scoring
│   │   └── CriteriaMatrix.svelte   # Pairwise comparison matrix
│   ├── data/
│   │   └── objectiveFountainPens.ts # 19 fountain pens + 12 criteria
│   ├── filtering.ts         # Search and filter logic
│   ├── scoring.ts          # Objective scoring algorithm  
│   └── types.ts            # TypeScript interfaces
├── routes/
│   └── +page.svelte        # Main application page
├── app.html               # HTML template
└── app.css               # Global styles
```

## Core Features

### Three Main Sections ("The Nerd Trilogy")

1. **"Nerd Out"** - Interactive D3.js scatter plot
   - X-axis: Cost ($)
   - Y-axis: Calculated score (0-100)
   - Color-coded dots by nib material
   - Responsive design with hover tooltips
   - Click dots for product links

2. **"Nerd Way Out"** - Expandable item list
   - Items sorted by calculated score
   - Click to expand for detailed specifications
   - FLIP animations for smooth reordering
   - Highlighting synced with plot

3. **"Nerd Way Way Out"** - Criteria management
   - **Spec Value Scoring**: Expandable accordions to score individual spec values (1-5 scale)
   - **Weight Adjustment**: Pairwise comparison matrix to set criteria importance
   - Real-time score recalculation

### Filtering System
- **Collapsible panel** (collapsed by default)
- **Text search** across names, descriptions, and specs
- **Advanced filters** with multiple operators (equals, greater than, contains, etc.)
- **Quick filter buttons** for common attributes
- **Smart operator detection** (numeric vs string vs array attributes)

### Objective Scoring System
- **99spokes-style approach**: Score individual spec values, not entire items
- **12 comprehensive criteria** based on fountain pen expert research
- **Automatic calculation**: Item scores derived from spec values and criteria weights
- **Default scores**: Handle missing specs gracefully (N/A = default value)

## Data Structure

### Items (Fountain Pens)
```typescript
interface Item {
  id: string;
  name: string;
  cost: number;
  description?: string;
  url?: string;
  specs: Record<string, string | null>; // criterion_id -> spec_value
}
```

### Criteria
```typescript
interface Criterion {
  id: string;
  name: string;
  description?: string;
  weight: number;                    // 0-1, sum to 1
  defaultScore: number;              // 1-5, for N/A cases
  values: Record<string, {           // possible spec values
    value: string;                   // display name
    score: number;                   // 1-5 user-assigned score
  }>;
}
```

## Key Algorithms

### Score Calculation
```typescript
// Item score = weighted average of criterion scores
// Each criterion score comes from the user-assigned value score (1-5)
// Missing specs use defaultScore
totalScore = Σ(criterionScore × weight) / Σ(weights) × 20  // Scale to 0-100
```

### Filtering Logic
- **Search**: Fuzzy matching across name, description, and spec values
- **Advanced filters**: Support for equals, greater/less than, contains, array operations
- **Filter chaining**: All filters must pass (AND logic)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting (if configured)
npm run lint

# Run type checking (if configured)  
npm run typecheck
```

## Important Implementation Details

### Svelte Reactivity Patterns
- **Array updates**: Must recreate arrays for reactivity (`items = [...items]`)
- **Object updates**: Use spread operator for nested updates
- **Reactive statements**: Use `$:` for computed values and side effects

### D3.js Integration
- **Responsive**: Uses ResizeObserver for container-based sizing
- **SVG approach**: Direct SVG manipulation with D3 selections
- **Tooltip positioning**: Relative to SVG with overflow detection
- **Color coding**: Dynamic based on `nib_material` spec

### State Management
- **Prop drilling**: Data flows down from main page component
- **Event dispatch**: Child components emit events for updates
- **Highlight sync**: Shared `highlightedItem` state across components

### Performance Considerations
- **FLIP animations**: Smooth list reordering without layout thrash
- **Debounced updates**: Prevent excessive recalculations
- **Stable sorting**: Maintain order during accordion operations

## Data Sources & Research

The fountain pen data and criteria are based on research from:
- **The Pen Addict**: Expert reviews and recommendations
- **Gentleman Stationer**: In-depth pen analysis
- **Well-Appointed Desk**: Comprehensive pen coverage
- **Community forums**: Real user experiences and preferences

### Criteria Weights (Research-Based Defaults)
1. **Nib Performance** (25%) - Writing smoothness, line variation
2. **Value for Money** (15%) - Cost vs feature ratio  
3. **Build Quality** (12%) - Materials, construction, durability
4. **Ink Flow** (10%) - Consistency, saturation
5. **Comfort & Ergonomics** (8%) - Grip, weight, balance
6. And 7 additional criteria...

## Extending the Project

### Adding New Product Categories
1. **Create data file**: Follow `objectiveFountainPens.ts` structure
2. **Define criteria**: Research-based with appropriate weights
3. **Update types**: Add category-specific specs if needed
4. **Customize visualization**: Adjust colors, axes labels

### Adding Features
- **Comparison mode**: Side-by-side item comparison
- **Export functionality**: PDF reports, data export
- **User preferences**: Save scoring preferences
- **Category switching**: Multi-product support

## Known Issues & Considerations

### Browser Compatibility
- **Modern browsers**: ES2020+ features used
- **Mobile responsive**: Tested on mobile devices
- **Touch interactions**: D3 events work with touch

### Performance
- **Large datasets**: Current implementation handles ~50 items smoothly
- **Real-time updates**: Scoring updates are immediate but could be debounced for huge datasets

### Accessibility
- **Keyboard navigation**: Some components need ARIA improvements
- **Screen readers**: Plot visualization needs alternative text descriptions
- **Color blind friendly**: Should add pattern/shape alternatives to color coding

## Future Enhancements

### Phase 2 Features
- **Multi-category support**: Bikes, headphones, etc.
- **User accounts**: Save preferences and custom criteria
- **Social features**: Share comparisons, community scoring
- **Advanced filtering**: Date ranges, custom formulas

### Technical Improvements
- **Testing**: Unit tests for scoring algorithm, component tests
- **Performance**: Virtual scrolling for large lists
- **PWA features**: Offline support, app shell
- **Analytics**: Usage tracking, popular comparisons

## Development Notes

### Component Responsibilities
- **FilterPanel**: Pure filtering UI, emits filter changes
- **NerdOut**: Pure visualization, receives data and highlight state
- **NerdWayOut**: Item display + highlight management
- **NerdWayWayOut**: Criteria management + scoring interface
- **Main page**: State management + data coordination

### State Flow
```
Main Page
├── Manages: items, criteria, filters, highlightedItem
├── FilterPanel (filters) → Main (filteredItems)
├── NerdOut (filteredItems, highlightedItem) 
├── NerdWayOut (filteredItems, highlightedItem) → Main (highlight changes)
└── NerdWayWayOut (criteria) → Main (criteria updates) → recalculate scores
```

This architecture makes the app maintainable and the scoring system easily adaptable to other product categories.