import { useRouter } from 'next/router';
import useSWR from 'swr';
import Form from '../../../components/forms/flatgroundTrick/form';

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const EditFlatGroundTrick = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data: flatgroundTrick, error } = useSWR(_id ? `/api/flatgroundtricks/${_id}` : null, fetcher);

  if (error) return <p>Failed to load FlatgroundTrick</p>;
  if (!flatgroundTrick) return <p>Loading...</p>;

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

  return <Form flatgroundTrickForm={flatgroundTrickForm} newFlatgroundTrick={false} />;
};

export default EditFlatGroundTrick;
