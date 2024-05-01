import ComboForm from '../components/forms/ComboForm';

export const newComboObj = {
  trickArray: [],
  landed: true,
};

export default function NewCombo() {
  return <ComboForm combo={newComboObj} />;
}
