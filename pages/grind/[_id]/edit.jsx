import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../lib/util';
import GrindForm from '../../../components/forms/grindForm';

const EditGrind = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data, error } = useSWR(_id ? `/api/grinds/${_id}` : null, fetcher);

  const grind = data?.data;
  const serverError = data?.error;

  if (error || serverError) return <p>Failed to load Grind: {error || serverError}</p>;
  if (!grind) return <p>Loading...</p>;

  const grindForm = {
    name: grind.name,
    preferred_stance: grind.preferred_stance,
    stance: grind.stance,
    direction: grind.direction,
    link: grind.link,
    date: new Date(grind.date).toISOString().substring(0, 10),
    image_url: grind.image_url,
  };

  return <GrindForm grindForm={grindForm} newGrind={false} />;
};

export default EditGrind;
