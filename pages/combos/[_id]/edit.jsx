import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../lib/clientUtils';
import ComboForm from '../../../components/forms/comboForm';

const EditGrind = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error, isLoading } = useSWR(_id ? `/api/combos/${_id}` : null, fetcher);
  const { data: combo, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load Combo: {error || serverError}</p>;
  if (!combo || isLoading) return <p>Loading...</p>;

  const comboForm = {
    trickArray: combo.trickArray,
  };

  return <ComboForm comboForm={comboForm} newCombo={false} />;
};

export default EditGrind;
