import React from 'react';

export const BarSearchContent = ({ show, suggestions, onSelectSuggestion }) => {
  if (!show) return null;

  return (
    <div className="position-absolute bg-white border rounded shadow w-100 mt-1" style={{ zIndex: 1050 }}>
      {suggestions.map((item, index) => (
        <div
          key={index}
          className="py-2 px-3 border-bottom hover-bg-light"
          style={{ cursor: 'pointer' }}
          onMouseDown={() => onSelectSuggestion(item)} // <-- use onMouseDown instead of onClick
        >
          {item}
        </div>
      ))}
    </div>
  );
};
