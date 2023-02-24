import GrindForm from '../components/forms/grindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';

const newGrind = () => {
  const grindForm = {
    name: DEFAULT_GRIND,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'none',
  };

  return <GrindForm grindForm={grindForm} />;
};

export default newGrind;
