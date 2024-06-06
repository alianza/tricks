import ManualForm from '../components/forms/ManualForm';
import { DEFAULT_MANUAL } from '../models/constants/manuals';
import { getDateString } from '../lib/commonUtils';

/**
 * The default Manual object
 * @type {Manual}
 */

export const newManualObj = {
  type: DEFAULT_MANUAL,
  landed: true,
  landedAt: getDateString(),
};

export default function NewManual() {
  return <ManualForm manual={newManualObj} />;
}
