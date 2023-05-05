import ManualForm from '../components/forms/manualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';
import { useCloseAfterQueryParam } from '../lib/customHooks';

export default function NewManual() {
  const newManual = {
    preferred_stance: 'regular',
    type: DEFAULT_MANUAL,
  };

  useCloseAfterQueryParam('closeAfterAdd');

  return <ManualForm manual={newManual} />;
}
