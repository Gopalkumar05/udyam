import React from 'react';


const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${disabled ? 'btn-disabled' : 'btn-primary'} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
