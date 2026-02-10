import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="input-icon-wrapper">
      <input
        id="search"
        type="search"
        className="input search-input"
        placeholder="Найти"
        value={value}
        onChange={onChange}
      />
      <span className="input-icon" aria-hidden="true">
        <SearchIcon />
      </span>
    </div>
  );
}
