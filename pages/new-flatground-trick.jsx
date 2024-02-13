import FlatgroundTrickForm from '../components/forms/FlatgroundTrickForm';
import { DEFAULT_FLATGROUND_TRICK } from '../models/constants/flatgroundTricks';
import { DEFAULT_PREFFERED_STANCE, DEFAULT_STANCE } from '../models/constants/stances';

const NewFlatFlatGroundTrick = () => {
  const newFlatgroundTrick = {
    name: DEFAULT_FLATGROUND_TRICK,
    preferred_stance: DEFAULT_PREFFERED_STANCE,
    stance: DEFAULT_STANCE,
    direction: 'none',
    rotation: 0,
  };

  return <FlatgroundTrickForm flatgroundTrick={newFlatgroundTrick} />;
};

export default NewFlatFlatGroundTrick;
