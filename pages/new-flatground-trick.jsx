import FlatgroundTrickForm from '../components/forms/flatgroundTrickForm';
import { DEFAULT_FLATGROUND_TRICK } from '../models/constants/flatgroundTricks';

const NewFlatFlatGroundTrick = () => {
  const flatgroundTrickForm = {
    name: DEFAULT_FLATGROUND_TRICK,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'none',
    rotation: 0,
    date: new Date().toISOString().substring(0, 10),
    link: '',
    image_url: '',
  };

  return <FlatgroundTrickForm flatgroundTrickForm={flatgroundTrickForm} />;
};

export default NewFlatFlatGroundTrick;
