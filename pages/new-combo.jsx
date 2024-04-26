import ComboForm from '../components/forms/ComboForm';

export const newComboObj = {
  trickArray: [],
};

export default function NewCombo() {
  return <ComboForm combo={newComboObj} />;
}
