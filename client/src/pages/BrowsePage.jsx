import Container from '../components/layout/Container';
import LoadList from '../components/reloading/LoadList';
import { useLoads } from '../hooks/useLoads';

export default function BrowsePage() {
  const { data, isLoading, error } = useLoads({ source: 'user' });

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">My Loads</h1>
      <p className="text-gray-600 mb-6">
        Loads you've created or imported. Use the Database tab to find reference data.
      </p>

      {data?.pagination && data.pagination.total > 0 && (
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
