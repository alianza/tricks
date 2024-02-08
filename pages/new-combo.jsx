import ComboForm from '../components/forms/ComboForm';

export default function NewCombo() {
  const newCombo = {
    trickArray: [],
  };

  return <ComboForm combo={newCombo} />;
}
