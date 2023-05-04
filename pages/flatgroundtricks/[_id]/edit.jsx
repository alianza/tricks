import { useRouter } from 'next/router';
import FlatgroundTrickForm from '../../../components/forms/flatgroundTrickForm';
import { fetcher } from '../../../lib/clientUtils';
import useSWR from 'swr';

const EditFlatGroundTrick = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useSWR(_id ? `/api/flatgroundtricks/${_id}` : null, fetcher);
  const { data: flatgroundTrick, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load FlatgroundTrick: {error || serverError}</p>;
  if (!flatgroundTrick || isLoading) return <p>Loading...</p>;

  return <FlatgroundTrickForm flatgroundTrick={flatgroundTrick} newFlatgroundTrick={false} />;
};

export default EditFlatGroundTrick;
