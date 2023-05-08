import GrindForm from '../components/forms/grindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';

export default function NewGrind() {
  const newGrind = {
    name: DEFAULT_GRIND,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'frontside',
  };

  return <GrindForm grind={newGrind} />;
}
