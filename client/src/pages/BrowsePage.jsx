import { useState } from 'react';
import Container from '../components/layout/Container';
import SearchFilter from '../components/reloading/SearchFilter';
import LoadList from '../components/reloading/LoadList';
import { useLoads } from '../hooks/useLoads';

export default function BrowsePage() {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useLoads(filters);

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">Browse Loads</h1>

      <SearchFilter onFilterChange={setFilters} />

      {data?.pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {data.loads.length} of {data.pagination.total} loads
        </div>
      )}

      <LoadList
        loads={data?.loads}
        isLoading={isLoading}
        error={error}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-6 text-center text-gray-600">
          Page {data.pagination.page} of {data.pagination.totalPages}
        </div>
      )}
    </Container>
  );
}
