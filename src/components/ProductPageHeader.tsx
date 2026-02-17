import { SearchField } from './ui/SearchField';

interface ProductPageHeaderProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

export function ProductPageHeader({ searchQuery, onSearchChange, onLogout }: ProductPageHeaderProps) {
  return (
    <header className="page-header">
      <h1>Товары</h1>
      <SearchField value={searchQuery} onChange={onSearchChange} />
      <button type="button" className="button secondary small" onClick={onLogout}>
        Выйти
      </button>
    </header>
  );
}
