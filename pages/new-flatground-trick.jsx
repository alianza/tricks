import FlatgroundTrickForm from '../components/forms/FlatgroundTrickForm';
import { DEFAULT_FLATGROUND_TRICK, DIRECTIONS } from '../models/constants/flatgroundTricks';
import { DEFAULT_PREFFERED_STANCE, DEFAULT_STANCE } from '../models/constants/stances';

export const newFlatgroundTrickObj = {
  name: DEFAULT_FLATGROUND_TRICK,
  preferred_stance: DEFAULT_PREFFERED_STANCE,
  stance: DEFAULT_STANCE,
  direction: DIRECTIONS.none,
  rotation: 0,
};

const NewFlatFlatGroundTrick = () => {
  return <FlatgroundTrickForm flatgroundTrick={newFlatgroundTrickObj} />;
};

export default NewFlatFlatGroundTrick;
