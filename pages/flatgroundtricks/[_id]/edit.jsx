import { useRouter } from 'next/router';
import FlatgroundTrickForm from '../../../components/forms/FlatgroundTrickForm';
import { useApiCall } from '../../../lib/customHooks';
import Loader from '../../../components/common/loader/loader';

const EditFlatGroundTrick = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, loading } = useApiCall(_id && 'flatgroundtricks', { method: 'GET', _id });
  const { data: flatgroundTrick, error: serverError } = data || {};

  if (error || serverError)
    return <p className="text-xl">Failed to load FlatgroundTrick: {(error || serverError).toString()}</p>;
  if (!flatgroundTrick || loading) return <Loader className="mx-auto my-24" />;

  return <FlatgroundTrickForm flatgroundTrick={flatgroundTrick} newFlatgroundTrick={false} />;
};

export default EditFlatGroundTrick;
