import FlatgroundTrickForm from '../components/forms/flatgroundTrickForm';
import { DEFAULT_FLATGROUND_TRICK } from '../models/constants/flatgroundTricks';
import { useCloseAfterQueryParam } from '../lib/customHooks';

const NewFlatFlatGroundTrick = () => {
  const newFlatgroundTrick = {
    name: DEFAULT_FLATGROUND_TRICK,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'none',
    rotation: 0,
  };

  useCloseAfterQueryParam('closeAfterAdd');

  return <FlatgroundTrickForm flatgroundTrick={newFlatgroundTrick} />;
};

export default NewFlatFlatGroundTrick;
