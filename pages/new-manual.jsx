import ManualForm from '../components/forms/ManualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';
import { DEFAULT_PREFFERED_STANCE } from '../models/constants/stances';

export default function NewManual() {
  const newManual = {
    preferred_stance: DEFAULT_PREFFERED_STANCE,
    type: DEFAULT_MANUAL,
  };

  return <ManualForm manual={newManual} />;
}
