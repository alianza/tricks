import ComboForm from '../components/forms/comboForm';

export default function NewCombo() {
  const newCombo = {
    trickArray: [],
  };

  return <ComboForm combo={newCombo} />;
}
