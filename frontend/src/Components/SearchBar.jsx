import React, { useState } from 'react';
import { BarSearchContent } from './BarSearchContent';
import { FaSearch } from 'react-icons/fa';
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
    <div className="position-relative w-100">
        <div className="input-group">
            <span className="input-group-text border-0 bg-for-search">
                <FaSearch size={14} className="text-muted" />
            </span>
            <input
                type="text"
                className="form-control border-0 bg-for-search"
                placeholder="Search products, brands and more"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      <BarSearchContent show={searchTerm.trim().length > 0} suggestions={filteredSuggestions} />
    </div>
  );
};
