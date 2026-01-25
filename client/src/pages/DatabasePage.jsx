import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import { useLoads } from '../hooks/useLoads';
import FilterDropdown from '../components/database/FilterDropdown';

export default function DatabasePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    sort_field: 'caliber',
    sort_order: 'asc',
    page: 1,
    limit: 50
  });

  const { data, isLoading, error } = useLoads(filters);

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sort_field: field,
      sort_order: prev.sort_field === field && prev.sort_order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleUseAsTemplate = (load) => {
    // Extract only the fields needed for template (exclude Excel-specific and session fields)
    const template = {
      caliber: load.caliber,
      test_weapon: load.test_weapon,
      bullet_manufacturer: load.bullet_manufacturer,
      bullet_type: load.bullet_type,
      bullet_weight_grains: load.bullet_weight_grains,
      powder_manufacturer: load.powder_manufacturer,
      powder_type: load.powder_type,
      charge_weight_grains: load.charge_weight_grains,
      velocity_ms: load.velocity_ms,
      total_cartridge_length_mm: load.total_cartridge_length_mm,
      primer_manufacturer: load.primer_manufacturer,
      primer_type: load.primer_type,
      case_manufacturer: load.case_manufacturer,
      free_travel_mm: load.free_travel_mm,
      notes: load.notes
    };

    navigate('/add', { state: { template } });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const clearFilters = () => {
    setFilters({
      sort_field: 'caliber',
      sort_order: 'asc',
      page: 1,
      limit: 50
    });
  };

  const SortIcon = ({ field }) => {
    if (filters.sort_field !== field) return <span className="text-gray-400">↕</span>;
    return filters.sort_order === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  if (error) {
    return (
      <Container>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading database: {error.message}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Load Database</h1>
        <p className="text-gray-600">
          Browse imported loads from the reloading database
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <FilterDropdown
            label="Caliber"
            column="caliber"
            value={filters.caliber}
            onChange={(value) => handleFilterChange('caliber', value)}
          />

          <FilterDropdown
            label="Bullet Manufacturer"
            column="bullet_manufacturer"
            value={filters.bullet_manufacturer}
            onChange={(value) => handleFilterChange('bullet_manufacturer', value)}
          />

          <FilterDropdown
            label="Bullet Type"
            column="bullet_type"
            value={filters.bullet_type}
            onChange={(value) => handleFilterChange('bullet_type', value)}
          />

          <FilterDropdown
            label="Bullet Weight (grains)"
            column="bullet_weight_grains"
            value={filters.bullet_weight_grains}
            onChange={(value) => handleFilterChange('bullet_weight_grains', value)}
          />

          <FilterDropdown
            label="Powder Manufacturer"
            column="powder_manufacturer"
            value={filters.powder_manufacturer}
            onChange={(value) => handleFilterChange('powder_manufacturer', value)}
          />

          <FilterDropdown
            label="Powder Type"
            column="powder_type"
            value={filters.powder_type}
            onChange={(value) => handleFilterChange('powder_type', value)}
          />

        </div>
      </div>

      {/* Results Count */}
      {data?.pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {data.loads.length} of {data.pagination.total} loads
          {Object.keys(filters).filter(k => k !== 'sort_field' && k !== 'sort_order' && k !== 'page' && k !== 'limit' && filters[k]).length > 0 && ' (filtered)'}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('caliber')}
                >
                  <div className="flex items-center gap-1">
                    Caliber <SortIcon field="caliber" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('bullet_manufacturer')}
                >
                  <div className="flex items-center gap-1">
                    Bullet <SortIcon field="bullet_manufacturer" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('bullet_weight_grains')}
                >
                  <div className="flex items-center gap-1">
                    Weight (gr) <SortIcon field="bullet_weight_grains" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('powder_manufacturer')}
                >
                  <div className="flex items-center gap-1">
                    Powder <SortIcon field="powder_manufacturer" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('charge_weight_grains')}
                >
                  <div className="flex items-center gap-1">
                    Charge (gr) <SortIcon field="charge_weight_grains" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('velocity_ms')}
                >
                  <div className="flex items-center gap-1">
                    Velocity (m/s) <SortIcon field="velocity_ms" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_cartridge_length_mm')}
                >
                  <div className="flex items-center gap-1">
                    OAL (mm) <SortIcon field="total_cartridge_length_mm" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    Loading database...
                  </td>
                </tr>
              ) : data?.loads && data.loads.length > 0 ? (
                data.loads.map((load) => (
                  <tr key={load.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {load.caliber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>{load.bullet_manufacturer}</div>
                      <div className="text-xs text-gray-500">{load.bullet_type}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {load.bullet_weight_grains}
                      {load.bullet_weight_grams && (
                        <div className="text-xs text-gray-500">
                          ({load.bullet_weight_grams}g)
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>{load.powder_manufacturer}</div>
                      <div className="text-xs text-gray-500">{load.powder_type}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {load.charge_weight_grains}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {load.velocity_ms}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {load.total_cartridge_length_mm}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {load.source}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleUseAsTemplate(load)}
                        className="inline-flex items-center px-3 py-1 border border-primary-600 text-primary-600 text-xs font-medium rounded hover:bg-primary-50 transition-colors"
                      >
                        Use as Template
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                    No loads found. Import data from the Import page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= data.pagination.totalPages}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Mobile Card View Note */}
      <div className="mt-4 text-sm text-gray-500 md:hidden">
        Tip: Rotate your device for better table viewing
      </div>
    </Container>
  );
}
