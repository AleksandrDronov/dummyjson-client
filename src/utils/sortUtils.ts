export type SortKey = 'title' | 'price' | 'brand' | 'sku' | 'rating';
export type SortDirection = 'asc' | 'desc';
export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

const SORT_STORAGE_KEY = 'dummyjson_products_sort';

export function compareValues(
  a: string | number,
  b: string | number,
  direction: SortDirection,
): number {
  if (a === b) return 0;
  const multiplier = direction === 'asc' ? 1 : -1;
  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * multiplier;
  }
  return String(a).localeCompare(String(b)) * multiplier;
}

export function loadInitialSort(): SortState {
  if (typeof window === 'undefined') {
    return { key: 'title', direction: 'asc' };
  }

  const raw = window.localStorage.getItem(SORT_STORAGE_KEY);
  if (!raw) {
    return { key: 'title', direction: 'asc' };
  }

  try {
    const parsed = JSON.parse(raw) as SortState;
    if (parsed.key && parsed.direction) {
      return parsed;
    }
  } catch {
    window.localStorage.removeItem(SORT_STORAGE_KEY);
  }

  return { key: 'title', direction: 'asc' };
}

export function persistSortState(sort: SortState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sort));
}
