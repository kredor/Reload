import { useNavigate } from 'react-router-dom';
import { useDeleteLoad } from '../../hooks/useLoads';

export default function LoadCard({ load }) {
  const navigate = useNavigate();
  const deleteLoad = useDeleteLoad();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this load?')) {
      await deleteLoad.mutateAsync(load.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${load.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 active:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-primary-600">{load.caliber}</h3>
          {load.test_weapon && (
            <p className="text-sm text-gray-600">{load.test_weapon}</p>
          )}
        </div>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
          {load.source}
        </span>
      </div>

      {/* Bullet and Powder Info */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium">Bullet</p>
          <p className="font-medium">
            {load.bullet_manufacturer || 'N/A'} {load.bullet_type || ''}
          </p>
          {load.bullet_weight_grains && (
            <p className="text-sm text-gray-600">{load.bullet_weight_grains} gr</p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-medium">Powder</p>
          <p className="font-medium">
            {load.powder_manufacturer || 'N/A'} {load.powder_type || ''}
          </p>
          {load.charge_weight_grains && (
            <p className="text-sm text-gray-600">{load.charge_weight_grains} gr</p>
          )}
        </div>
      </div>

      {/* Performance */}
      {(load.velocity_ms || load.group_size_mm) && (
        <div className="flex gap-4 text-sm border-t pt-2 mb-3">
          {load.velocity_ms && (
            <span className="flex items-center">
              <span className="mr-1">🎯</span>
              {load.velocity_ms} m/s
            </span>
          )}
          {load.group_size_mm && load.distance_meters && (
            <span className="flex items-center">
              <span className="mr-1">📏</span>
              {load.group_size_mm} mm @ {load.distance_meters}m
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      {load.notes && (
        <p className="text-sm text-gray-600 italic mb-3 line-clamp-2">
          {load.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-md font-medium hover:bg-primary-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="py-2 px-4 border border-red-300 text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors"
          disabled={deleteLoad.isPending}
        >
          {deleteLoad.isPending ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
