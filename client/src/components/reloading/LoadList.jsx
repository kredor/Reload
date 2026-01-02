import LoadCard from './LoadCard';

export default function LoadList({ loads, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error loading loads: {error.message}
      </div>
    );
  }

  if (!loads || loads.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg mb-2">No loads found</p>
        <p className="text-gray-500 text-sm">
          Add your first load or adjust your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loads.map((load) => (
        <LoadCard key={load.id} load={load} />
      ))}
    </div>
  );
}
