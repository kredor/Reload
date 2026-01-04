import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Container from '../components/layout/Container';
import LoadForm from '../components/reloading/LoadForm';
import { useLoad, useCreateLoad, useUpdateLoad } from '../hooks/useLoads';

export default function AddLoadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: existingLoad } = useLoad(id);
  const createLoad = useCreateLoad();
  const updateLoad = useUpdateLoad();

  // Extract template from location state (for duplicate functionality)
  const template = location.state?.template;

  // Prepare initial data based on context
  let initialData;
  if (isEditing) {
    // Editing existing load
    initialData = existingLoad;
  } else if (template) {
    // Duplicating from template - copy config, reset session fields
    initialData = {
      // Copy load configuration
      caliber: template.caliber,
      test_weapon: template.test_weapon,
      bullet_manufacturer: template.bullet_manufacturer,
      bullet_type: template.bullet_type,
      bullet_weight_grains: template.bullet_weight_grains,
      powder_manufacturer: template.powder_manufacturer,
      powder_type: template.powder_type,
      charge_weight_grains: template.charge_weight_grains,
      primer_manufacturer: template.primer_manufacturer,
      primer_type: template.primer_type,
      case_manufacturer: template.case_manufacturer,
      total_cartridge_length_mm: template.total_cartridge_length_mm,
      free_travel_mm: template.free_travel_mm,
      velocity_ms: template.velocity_ms,
      group_size_mm: template.group_size_mm,
      distance_meters: template.distance_meters,
      temperature_celsius: template.temperature_celsius,
      humidity_percent: template.humidity_percent,
      barrel_length_inches: template.barrel_length_inches,
      twist_rate: template.twist_rate,
      notes: template.notes,

      // Reset session-specific fields
      loading_date: null,
      cartridges_loaded: null,
      batch_number: null,
      tested_date: null,
      group_photo_path: null
    };
  } else {
    // Creating new load from scratch
    initialData = undefined;
  }

  const handleSubmit = async (data) => {
    try {
      // If data is FormData (for file uploads), pass it through as-is
      // Otherwise, clean up empty strings
      let cleanData;
      if (data instanceof FormData) {
        cleanData = data;
      } else {
        cleanData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            value === '' ? null : value,
          ])
        );
      }

      if (isEditing) {
        await updateLoad.mutateAsync({ id, data: cleanData });
      } else {
        await createLoad.mutateAsync(cleanData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving load:', error);
      alert('Failed to save load. Please try again.');
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Load' : 'Add New Load'}
      </h1>

      <LoadForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={createLoad.isPending || updateLoad.isPending}
      />
    </Container>
  );
}
