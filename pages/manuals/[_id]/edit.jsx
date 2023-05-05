import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../lib/clientUtils';
import ManualForm from '../../../components/forms/manualForm';

const EditManual = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useSWR(_id ? `/api/manuals/${_id}` : null, fetcher);
  const { data: manual, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Manual: {error || serverError}</p>;
  if (!manual || isLoading) return <p>Loading...</p>;

  return <ManualForm manual={manual} newManual={false} />;
};

export default EditManual;
