import ComboForm from '../components/forms/ComboForm';
import { getDateString } from '../lib/commonUtils';

export const newComboObj = {
  trickArray: [],
  landed: true,
  landedAt: getDateString(),
};

export default function NewCombo() {
  return <ComboForm combo={newComboObj} />;
}
