import { useState, useRef, useEffect } from 'react';
import { useDistinctValues } from '../../hooks/useImport';

export default function FilterDropdown({ label, column, value, onChange, enabled = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const { data: options = [], isLoading } = useDistinctValues(column, enabled);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setSearch('');
  };

  const displayValue = value || '';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={isLoading ? "Loading..." : "Select or type..."}
          disabled={isLoading}
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {value && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 px-1"
              title="Clear"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-600 px-1"
          >
            {isOpen ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <>
              {/* Show count */}
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-200">
                {filteredOptions.length} {filteredOptions.length === 1 ? 'option' : 'options'}
                {search && ` matching "${search}"`}
              </div>

              {/* Options list */}
              {filteredOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors ${
                    option === value ? 'bg-primary-100 font-medium' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              {search ? `No matches for "${search}"` : 'No options available'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
