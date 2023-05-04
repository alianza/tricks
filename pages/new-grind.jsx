import GrindForm from '../components/forms/grindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';
import { useCloseAfterAdd } from '../lib/customHooks';

export default function NewGrind() {
  const newGrind = {
    name: DEFAULT_GRIND,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'frontside',
  };

  useCloseAfterAdd();

  return <GrindForm grind={newGrind} />;
}
