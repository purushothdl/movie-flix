import React from 'react';

const PaginationButton = ({ children, onClick, disabled, isActive, hoverColor }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded transition-colors duration-200 ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
      } ${
        hoverColor && !disabled ? `hover:${hoverColor}` : ''
      } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default PaginationButton; 