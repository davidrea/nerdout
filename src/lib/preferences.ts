import type { Criterion } from './types';

const STORAGE_KEY = 'nerdout_preferences';

export interface UserPreferences {
  comparisonMatrix?: Record<string, Record<string, 'up' | 'left' | 'equal'>>;
  criteriaScores?: Record<string, Record<string, number>>; // criterionId -> { valueKey -> score }
  version?: string; // for future compatibility
}

/**
 * Save user preferences to local storage
 */
export function savePreferences(preferences: UserPreferences): void {
  try {
    const data = {
      ...preferences,
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save preferences to local storage:', error);
  }
}

/**
 * Load user preferences from local storage
 */
export function loadPreferences(): UserPreferences | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const preferences = JSON.parse(data);
    return preferences;
  } catch (error) {
    console.error('Failed to load preferences from local storage:', error);
    return null;
  }
}

/**
 * Save comparison matrix to local storage
 */
export function saveComparisonMatrix(comparisonMatrix: Record<string, Record<string, 'up' | 'left' | 'equal'>>): void {
  const existing = loadPreferences() || {};
  savePreferences({
    ...existing,
    comparisonMatrix
  });
}

/**
 * Save criteria value scores to local storage
 */
export function saveCriteriaScores(criteria: Criterion[]): void {
  const existing = loadPreferences() || {};

  // Extract just the scores from criteria
  const criteriaScores: Record<string, Record<string, number>> = {};
  criteria.forEach(criterion => {
    criteriaScores[criterion.id] = {};
    Object.entries(criterion.values).forEach(([key, value]) => {
      criteriaScores[criterion.id][key] = value.score;
    });
  });

  savePreferences({
    ...existing,
    criteriaScores
  });
}

/**
 * Apply loaded preferences to criteria array
 */
export function applyCriteriaScores(criteria: Criterion[], preferences: UserPreferences): Criterion[] {
  if (!preferences.criteriaScores) return criteria;

  return criteria.map(criterion => {
    const savedScores = preferences.criteriaScores?.[criterion.id];
    if (!savedScores) return criterion;

    // Update scores for values that exist in saved preferences
    const updatedValues = { ...criterion.values };
    Object.entries(updatedValues).forEach(([key, value]) => {
      if (savedScores[key] !== undefined) {
        updatedValues[key] = { ...value, score: savedScores[key] };
      }
    });

    return {
      ...criterion,
      values: updatedValues
    };
  });
}

/**
 * Clear all preferences from local storage
 */
export function clearPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear preferences from local storage:', error);
  }
}
