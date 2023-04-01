import GrindForm from '../components/forms/grindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';

const newGrind = () => {
  const grindForm = {
    name: DEFAULT_GRIND,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'frontside',
  };

  return <GrindForm grindForm={grindForm} />;
};

export default newGrind;
