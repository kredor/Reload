import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import { useLoad, useDeleteLoad } from '../hooks/useLoads';

export default function LoadDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: load, isLoading } = useLoad(id);
  const deleteLoad = useDeleteLoad();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this load?')) {
      await deleteLoad.mutateAsync(id);
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Container>
        <div className="text-center py-8">Loading...</div>
      </Container>
    );
  }

  if (!load) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Load not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Back to Browse
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-600">{load.caliber}</h1>
          {load.test_weapon && (
            <p className="text-lg text-gray-600 mt-1">{load.test_weapon}</p>
          )}
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
          {load.source}
        </span>
      </div>

      {/* Group Photo */}
      {load.group_photo_path && (
        <div className="mb-6">
          <img
            src={load.group_photo_path}
            alt="Group size"
            className="max-w-full h-auto rounded-lg border-2 border-gray-200 shadow-md"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Loading Information */}
      {(load.loading_date || load.cartridges_loaded || load.batch_number) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Loading Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {load.loading_date && (
              <div>
                <p className="text-sm text-gray-500">Loading Date</p>
                <p className="font-medium">{formatDate(load.loading_date)}</p>
              </div>
            )}
            {load.cartridges_loaded && (
              <div>
                <p className="text-sm text-gray-500">Quantity Loaded</p>
                <p className="font-medium">{load.cartridges_loaded}</p>
              </div>
            )}
            {load.batch_number && (
              <div>
                <p className="text-sm text-gray-500">Batch Number</p>
                <p className="font-medium">{load.batch_number}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bullet Information */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Bullet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Manufacturer</p>
            <p className="font-medium">{load.bullet_manufacturer || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{load.bullet_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium">{load.bullet_weight_grains ? `${load.bullet_weight_grains} gr` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Powder Information */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Powder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Manufacturer</p>
            <p className="font-medium">{load.powder_manufacturer || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{load.powder_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Charge Weight</p>
            <p className="font-medium">{load.charge_weight_grains ? `${load.charge_weight_grains} gr` : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Primer Information */}
      {(load.primer_manufacturer || load.primer_type) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Primer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Manufacturer</p>
              <p className="font-medium">{load.primer_manufacturer || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{load.primer_type || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cartridge Information */}
      {(load.case_manufacturer || load.total_cartridge_length_mm || load.free_travel_mm) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Cartridge</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {load.case_manufacturer && (
              <div>
                <p className="text-sm text-gray-500">Case Manufacturer</p>
                <p className="font-medium">{load.case_manufacturer}</p>
              </div>
            )}
            {load.total_cartridge_length_mm && (
              <div>
                <p className="text-sm text-gray-500">Total Length</p>
                <p className="font-medium">{load.total_cartridge_length_mm} mm</p>
              </div>
            )}
            {load.free_travel_mm && (
              <div>
                <p className="text-sm text-gray-500">Free Travel</p>
                <p className="font-medium">{load.free_travel_mm} mm</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Information */}
      {(load.velocity_ms || load.group_size_mm || load.velocity_sd || load.velocity_es || load.tested_date) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {load.velocity_ms && (
              <div>
                <p className="text-sm text-gray-500">Velocity</p>
                <p className="font-medium">{load.velocity_ms} m/s</p>
              </div>
            )}
            {load.velocity_sd && (
              <div>
                <p className="text-sm text-gray-500">Velocity SD</p>
                <p className="font-medium">{load.velocity_sd}</p>
              </div>
            )}
            {load.velocity_es && (
              <div>
                <p className="text-sm text-gray-500">Velocity ES</p>
                <p className="font-medium">{load.velocity_es}</p>
              </div>
            )}
            {load.group_size_mm && (
              <div>
                <p className="text-sm text-gray-500">Group Size</p>
                <p className="font-medium">{load.group_size_mm} mm</p>
              </div>
            )}
            {load.distance_meters && (
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-medium">{load.distance_meters} m</p>
              </div>
            )}
            {load.tested_date && (
              <div>
                <p className="text-sm text-gray-500">Test Date</p>
                <p className="font-medium">{formatDate(load.tested_date)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {load.notes && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Notes</h2>
          <p className="text-gray-700">{load.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/edit/${id}`)}
          className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="py-3 px-6 border border-red-300 text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors"
          disabled={deleteLoad.isPending}
        >
          {deleteLoad.isPending ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="py-3 px-6 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </Container>
  );
}
