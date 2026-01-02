import { useState, useEffect } from 'react';
import { useFilterOptions } from '../../hooks/useLoads';

export default function SearchFilter({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [caliber, setCaliber] = useState('');
  const [powderType, setPowderType] = useState('');
  const [source, setSource] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: filterOptions } = useFilterOptions();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        caliber,
        powder_type: powderType,
        source,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, caliber, powderType, source, onFilterChange]);

  const clearFilters = () => {
    setSearch('');
    setCaliber('');
    setPowderType('');
    setSource('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search loads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Toggle Filters Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="text-primary-600 font-medium mb-3 flex items-center"
      >
        {showFilters ? '▼' : '▶'} Filters
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Caliber Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caliber
              </label>
              <select
                value={caliber}
                onChange={(e) => setCaliber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Calibers</option>
                {filterOptions?.calibers?.map((cal) => (
                  <option key={cal} value={cal}>
                    {cal}
                  </option>
                ))}
              </select>
            </div>

            {/* Powder Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Powder Type
              </label>
              <select
                value={powderType}
                onChange={(e) => setPowderType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Powders</option>
                {filterOptions?.powderTypes?.map((powder) => (
                  <option key={powder} value={powder}>
                    {powder}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                <option value="user">User</option>
                <option value="imported">Imported</option>
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-primary-600"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
