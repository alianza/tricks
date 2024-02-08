import FlatgroundTrickForm from '../components/forms/FlatgroundTrickForm';
import { DEFAULT_FLATGROUND_TRICK } from '../models/constants/flatgroundTricks';

const NewFlatFlatGroundTrick = () => {
  const newFlatgroundTrick = {
    name: DEFAULT_FLATGROUND_TRICK,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'none',
    rotation: 0,
  };

  return <FlatgroundTrickForm flatgroundTrick={newFlatgroundTrick} />;
};

export default NewFlatFlatGroundTrick;
