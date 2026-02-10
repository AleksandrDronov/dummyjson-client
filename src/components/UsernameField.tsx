import { UserIcon } from './icons/UserIcon';
import { ClearIcon } from './icons/ClearIcon';
import React from 'react';

interface UsernameFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export function UsernameField({
  value,
  onChange,
  onBlur,
  onClear,
  disabled = false,
  error,
  touched,
}: UsernameFieldProps) {
  return (
    <div className="field-group">
      <label htmlFor="username">Логин</label>
      <div className="input-icon-wrapper">
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={touched && error ? 'input error' : 'input'}
          required
        />
        <span className="input-icon" aria-hidden="true">
          <UserIcon />
        </span>
        {value && !disabled && (
          <button
            type="button"
            className="clear-input-btn"
            aria-label="Очистить логин"
            tabIndex={0}
            onClick={onClear}
          >
            <ClearIcon />
          </button>
        )}
      </div>
      <span className="field-error">{touched && error}</span>
    </div>
  );
}
