import ManualForm from '../components/forms/ManualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';

export default function NewManual() {
  const newManual = {
    preferred_stance: 'regular',
    type: DEFAULT_MANUAL,
  };

  return <ManualForm manual={newManual} />;
}
