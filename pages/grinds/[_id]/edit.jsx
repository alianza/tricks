import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../lib/clientUtils';
import GrindForm from '../../../components/forms/grindForm';

const EditGrind = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useSWR(_id ? `/api/grinds/${_id}` : null, fetcher);
  const { data: grind, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Grind: {error || serverError}</p>;
  if (!grind || isLoading) return <p>Loading...</p>;

  return <GrindForm grind={grind} newGrind={false} />;
};

export default EditGrind;
