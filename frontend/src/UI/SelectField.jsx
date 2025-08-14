import React from 'react';


const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  disabled = false
}) => {
  return (
    <div className="select-wrapper">
      <label htmlFor={name} className="select-label">
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`select-field ${disabled ? 'select-disabled' : ''}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
