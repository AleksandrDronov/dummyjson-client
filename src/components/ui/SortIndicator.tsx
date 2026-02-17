import type { SortDirection } from '../../utils/sortUtils';

interface SortIndicatorProps {
  direction: SortDirection;
}

export function SortIndicator({ direction }: SortIndicatorProps) {
  return <span className="sort-indicator">{direction === 'asc' ? '▲' : '▼'}</span>;
}
