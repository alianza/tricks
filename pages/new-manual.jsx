import ManualForm from '../components/forms/ManualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';
import { getDate } from '../lib/commonUtils';

export const newManualObj = {
  type: DEFAULT_MANUAL,
  landed: true,
  landedAt: getDate(),
};

export default function NewManual() {
  return <ManualForm manual={newManualObj} />;
}
