import ComboForm from '../components/forms/ComboForm';
import { getDate } from '../lib/commonUtils';

export const newComboObj = {
  trickArray: [],
  landed: true,
  landedAt: getDate(),
};

export default function NewCombo() {
  return <ComboForm combo={newComboObj} />;
}
