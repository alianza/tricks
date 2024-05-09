import ManualForm from '../components/forms/ManualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';
import { DEFAULT_PREFFERED_STANCE } from '../models/constants/stances';
import { getDate } from '../lib/commonUtils';

export const newManualObj = {
  preferred_stance: DEFAULT_PREFFERED_STANCE,
  type: DEFAULT_MANUAL,
  landed: true,
  landedAt: getDate(),
};

export default function NewManual() {
  return <ManualForm manual={newManualObj} />;
}
