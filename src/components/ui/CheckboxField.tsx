import React from 'react';

interface CheckboxFieldProps {
  name: string;
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
}

export function CheckboxField({
  name,
  value,
  onChange,
  disabled,
  label = 'Запомнить меня',
}: CheckboxFieldProps) {
  return (
    <div className="field-row">
      <label className="checkbox-label custom-checkbox">
        <input
          type="checkbox"
          name={name}
          checked={value}
          onChange={onChange}
          disabled={disabled}
          className="checkbox-input"
        />
        <span className="checkbox-custom" aria-hidden="true"></span>
        <span className="checkbox-label-text">{label}</span>
      </label>
    </div>
  );
}
