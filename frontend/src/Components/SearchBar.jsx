import React, { useState } from 'react';
import { BarSearchContent } from './BarSearchContent';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const suggestions = [
    'laptops',
    'laptops under 50000',
    'laptops 12gen',
    'lenovo laptop',
    'apple laptop',
    'laptops with fingerprint',
    'laptops led display',
    'laptops rtx3050',
    'laptops office for work',
  ];

  const filteredSuggestions = suggestions.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="position-relative w-50">
      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <BarSearchContent show={searchTerm.trim().length > 0} suggestions={filteredSuggestions} />
    </div>
  );
};
