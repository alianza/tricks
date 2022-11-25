import Form from "../components/form/form";

const NewPet = () => {
  const petForm = {
    name: "",
    owner_name: "",
    species: "",
    birthdate: new Date().toISOString().substring(0, 10),
    potty_trained: false,
    diet: [],
    image_url: "",
    likes: [],
    dislikes: [],
  };

  return <Form formId="add-pet-form" petForm={petForm} />;
};

export default NewPet;
