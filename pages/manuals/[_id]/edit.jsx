import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../lib/util';
import ManualForm from '../../../components/forms/manualForm';

const EditManual = () => {
  const { _id } = useRouter().query;
  const { data, error, isLoading } = useSWR(_id ? `/api/manuals/${_id}` : null, fetcher);
  const { data: manual, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Manual: {error || serverError}</p>;
  if (!manual || isLoading) return <p>Loading...</p>;

  const manualForm = {
    preferred_stance: manual.preferred_stance,
    type: manual.type,
  };

  return <ManualForm manualForm={manualForm} newManual={false} />;
};

export default EditManual;
