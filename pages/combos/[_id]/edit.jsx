import { useRouter } from 'next/router';
import ComboForm from '../../../components/forms/comboForm';
import { useApiCall } from '../../../lib/customHooks';

const EditCombo = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useApiCall(_id && 'combos', { method: 'GET', _id });
  const { data: combo, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Combo: {error || serverError}</p>;
  if (!combo || isLoading) return <p>Loading...</p>;

  return <ComboForm combo={combo} newCombo={false} />;
};

export default EditCombo;
