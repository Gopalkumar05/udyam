import React from 'react';


const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  error = null,
  maxLength = null,
  textarea = false,
  rows = 4,
  disabled = false
}) => {
  return (
    <div className="input-wrapper">
      <label htmlFor={name} className="input-label">
        {label}
      </label>

      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
        />
      )}

      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};

export default InputField;
