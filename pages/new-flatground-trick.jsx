import FlatgroundTrickForm from '../components/forms/FlatgroundTrickForm';
import { DEFAULT_FLATGROUND_TRICK, DIRECTIONS } from '../models/constants/flatgroundTricks';
import { DEFAULT_STANCE } from '../models/constants/stances';
import { getDateString } from '../lib/commonUtils';

export const newFlatgroundTrickObj = {
  name: DEFAULT_FLATGROUND_TRICK,
  stance: DEFAULT_STANCE,
  direction: DIRECTIONS.none,
  rotation: 0,
  landed: true,
  landedAt: getDateString(),
};

const NewFlatFlatGroundTrick = () => {
  return <FlatgroundTrickForm flatgroundTrick={newFlatgroundTrickObj} />;
};

export default NewFlatFlatGroundTrick;
