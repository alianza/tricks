import { useRouter } from 'next/router';
import ComboForm from '../../../components/forms/ComboForm';
import { useApiCall } from '../../../lib/customHooks';
import Loader from '../../../components/common/loader';

const EditCombo = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading: loading } = useApiCall(_id && 'combos', { method: 'GET', _id });
  const { data: combo, error: serverError } = data || {};

  if (error || serverError) return <p className="text-xl">Failed to load Combo: {(error || serverError).toString()}</p>;
  if (!combo || loading) return <Loader className="mx-auto my-24" />;

  return <ComboForm combo={combo} newCombo={false} />;
};

export default EditCombo;
