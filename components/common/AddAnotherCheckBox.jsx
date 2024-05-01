function AddAnotherCheckBox({ checked, onChange }) {
  return (
    <label title="Reset the form after creation">
      <input type="checkbox" checked={checked} onChange={onChange} name="addAnother" className="h-4 w-4 align-middle" />
      <span className="ml-2 align-middle">Add another</span>
    </label>
  );
}

export default AddAnotherCheckBox;
