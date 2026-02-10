import { UserIcon } from './icons/UserIcon';
import { ClearIcon } from './icons/ClearIcon';
import React from 'react';

interface TextInputFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  hasAppendIcon?: boolean;
  hasPrependIcon?: boolean;
}

export function TextInputField({
  name,
  label,
  value,
  onChange,
  onBlur,
  onClear,
  disabled = false,
  error,
  touched,
  hasAppendIcon = false,
  hasPrependIcon = false,
}: TextInputFieldProps) {
  return (
    <div className="field-group">
      <label htmlFor={name}>{label}</label>
      <div className={hasAppendIcon ? 'input-icon-wrapper' : ''}>
        <input
          id={name}
          name={name}
          type="text"
          autoComplete={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={touched && error ? 'input error' : 'input'}
          required
        />
        {hasAppendIcon && <span className="input-icon" aria-hidden="true">
          <UserIcon />
        </span>}
        {hasPrependIcon && value && !disabled && (
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
