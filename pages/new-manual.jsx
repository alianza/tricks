import ManualForm from '../components/forms/manualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';

const newGrind = () => {
  const manualForm = {
    preferred_stance: 'regular',
    type: DEFAULT_MANUAL,
  };

  return <ManualForm manualForm={manualForm} />;
};

export default newGrind;
