import React from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { LockIcon } from './icons/LockIcon';

interface PasswordFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  setShowPassword: (v: boolean) => void;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
  showPassword: boolean;
}

export function PasswordField({
  value,
  onChange,
  onBlur,
  disabled,
  error,
  touched,
  showPassword,
  setShowPassword,
}: PasswordFieldProps) {
  return (
    <div className="field-group">
      <label htmlFor="password">Пароль</label>
      <div className="password-input-wrapper">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={
            (touched && error ? 'input error' : 'input') + ' password-input'
          }
          required
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle-btn"
        >
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </button>
        <span className="input-icon" aria-hidden="true">
          <LockIcon />
        </span>
      </div>
      <span className="field-error">{touched && error}</span>
    </div>
  );
}
