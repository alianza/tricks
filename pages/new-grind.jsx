import GrindForm from '../components/forms/grindForm';
import { DEFAULT_GRIND } from '../models/constants/grinds';

const newGrind = () => {
  const grindForm = {
    name: DEFAULT_GRIND,
    preferred_stance: 'regular',
    stance: 'regular',
    direction: 'none',
    date: new Date().toISOString().substring(0, 10),
    link: '',
    image_url: '',
  };

  return <GrindForm grindForm={grindForm} />;
};

export default newGrind;
