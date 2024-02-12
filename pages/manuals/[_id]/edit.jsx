import { useRouter } from 'next/router';
import ManualForm from '../../../components/forms/ManualForm';
import { useApiCall } from '../../../lib/customHooks';
import Loader from '../../../components/common/loader/loader';

const EditManual = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, loading } = useApiCall(_id && 'manuals', { method: 'GET', _id });
  const { data: manual, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Manual: {error || serverError}</p>;
  if (!manual || loading) return <Loader className="mx-auto my-24" />;

  return <ManualForm manual={manual} newManual={false} />;
};

export default EditManual;
