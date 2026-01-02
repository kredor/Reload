import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import LoadForm from '../components/reloading/LoadForm';
import { useLoad, useCreateLoad, useUpdateLoad } from '../hooks/useLoads';

export default function AddLoadPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: existingLoad } = useLoad(id);
  const createLoad = useCreateLoad();
  const updateLoad = useUpdateLoad();

  const handleSubmit = async (data) => {
    try {
      // Remove empty string values and convert to null
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === '' ? null : value,
        ])
      );

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
        initialData={existingLoad}
        onSubmit={handleSubmit}
        isSubmitting={createLoad.isPending || updateLoad.isPending}
      />
    </Container>
  );
}
