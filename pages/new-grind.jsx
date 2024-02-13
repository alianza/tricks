import GrindForm from '../components/forms/GrindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';
import { DEFAULT_PREFFERED_STANCE, DEFAULT_STANCE } from '../models/constants/stances';

export default function NewGrind() {
  const newGrind = {
    name: DEFAULT_GRIND,
    preferred_stance: DEFAULT_PREFFERED_STANCE,
    stance: DEFAULT_STANCE,
    direction: 'frontside',
  };

  return <GrindForm grind={newGrind} />;
}
