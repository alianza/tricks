import Form from "../components/forms/flatgroundTrick/form";

const NewFlatFlatGroundTrick = () => {
  const flatgroundTrickForm = {
    name: "",
    preferred_stance: "regular",
    stance: "regular",
    direction: "",
    date: new Date().toISOString().substring(0, 10),
    link: "",
    image_url: "",
    description: "",
    landed: false,
    location: { longitude: 0, latitude: 0 },
  };

  return <Form formId="add-flatground-trick-form" flatgroundTrickForm={flatgroundTrickForm} />;
};

export default NewFlatFlatGroundTrick;
