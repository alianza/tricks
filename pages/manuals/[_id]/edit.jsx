import { useRouter } from 'next/router';
import ManualForm from '../../../components/forms/manualForm';
import { useApiCall } from '../../../lib/customHooks';

const EditManual = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useApiCall(_id && 'manuals', { method: 'GET', _id });
  const { data: manual, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Manual: {error || serverError}</p>;
  if (!manual || isLoading) return <p>Loading...</p>;

  return <ManualForm manual={manual} newManual={false} />;
};

export default EditManual;
