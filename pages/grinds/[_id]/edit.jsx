import { useRouter } from 'next/router';
import GrindForm from '../../../components/forms/grindForm';
import { useApiCall } from '../../../lib/customHooks';

const EditGrind = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useApiCall(_id && 'grinds', { method: 'GET', _id });
  const { data: grind, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Grind: {error || serverError}</p>;
  if (!grind || isLoading) return <p>Loading...</p>;

  return <GrindForm grind={grind} newGrind={false} />;
};

export default EditGrind;
