import { useRouter } from 'next/router';
import GrindForm from '../../../components/forms/GrindForm';
import { useApiCall } from '../../../lib/customHooks';
import Loader from '../../../components/common/loader/loader';

const EditGrind = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading: loading } = useApiCall(_id && 'grinds', { method: 'GET', _id });
  const { data: grind, error: serverError } = data || {};

  if (error || serverError) return <p className="text-xl">Failed to load Grind: {(error || serverError).toString()}</p>;
  if (!grind || loading) return <Loader className="mx-auto my-24" />;

  return <GrindForm grind={grind} newGrind={false} />;
};

export default EditGrind;
