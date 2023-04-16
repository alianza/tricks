import ComboForm from '../components/forms/comboForm';

export default function NewCombo() {
  const comboForm = {
    trickArray: [],
  };

  return <ComboForm comboForm={comboForm} />;
}
