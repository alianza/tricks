import { useRouter } from 'next/router';
import FlatgroundTrickForm from '../../../components/forms/flatgroundTrickForm';
import { fetcher } from '../../../lib/util';
import useSWR from 'swr';

const EditFlatGroundTrick = () => {
  const { _id } = useRouter().query;
  const { data, error, isLoading } = useSWR(_id ? `/api/flatgroundtricks/${_id}` : null, fetcher);
  const { data: flatgroundTrick, error: serverError } = data || {};

  if (error || serverError) return <p>Failed to load FlatgroundTrick: {error || serverError}</p>;
  if (!flatgroundTrick || isLoading) return <p>Loading...</p>;

  const flatgroundTrickForm = {
    name: flatgroundTrick.name,
    preferred_stance: flatgroundTrick.preferred_stance,
    stance: flatgroundTrick.stance,
    direction: flatgroundTrick.direction,
    rotation: flatgroundTrick.rotation,
    link: flatgroundTrick.link,
    date: new Date(flatgroundTrick.date).toISOString().substring(0, 10),
    image_url: flatgroundTrick.image_url,
  };

  return <FlatgroundTrickForm flatgroundTrickForm={flatgroundTrickForm} newFlatgroundTrick={false} />;
};

export default EditFlatGroundTrick;
