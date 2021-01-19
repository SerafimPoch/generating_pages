import React from 'react';
import cs from 'classnames';
import { nanoid } from 'nanoid';

export default ({ onChange, value, options }) => {
  const change = option => e => {
    e.preventDefault();
    onChange(option.value);
  };

  return (
    <div className="Options">
      {options.map(option => (
        <button
          type="button"
          key={nanoid()}
          onClick={change(option)}
          className={cs('btn', 'option', { option_active: option.value === value })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
