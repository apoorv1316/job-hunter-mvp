'use client';

import { useState, useRef, useEffect } from 'react';

export default function SearchableDropdown({
  placeholder,
  value,
  onChange,
  options = [],
  className = '',
  multiSelect = false,
  searchable = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchable) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, searchable]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option.value);
      const newValues = isSelected
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      onChange(newValues);
      setSearchTerm('');
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    if (searchable) {
      setSearchTerm(e.target.value);
      if (!isOpen) setIsOpen(true);
    }
  };

  const displayValue = multiSelect 
    ? (Array.isArray(value) && value.length > 0 ? `${value.length} selected` : '')
    : (value ? options.find(opt => opt.value === value)?.label || value : '');

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="w-full px-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder:text-gray-600"
        placeholder={placeholder}
        value={isOpen && searchable ? searchTerm : displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        autoComplete="off"
        readOnly={!searchable}
      />
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {((multiSelect && Array.isArray(value) && value.length > 0) || (!multiSelect && value && searchable)) && (
            <div
              className="px-3 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
              onClick={() => onChange(multiSelect ? [] : '')}
            >
              Clear selection
            </div>
          )}
          
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between ${
                  (multiSelect 
                    ? (Array.isArray(value) && value.includes(option.value))
                    : value === option.value
                  ) ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-900'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <span>{option.label}</span>
                {multiSelect && Array.isArray(value) && value.includes(option.value) && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}