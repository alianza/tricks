import { useRouter } from "next/router";
import useSWR from "swr";
import Form from "../../components/form/form";

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const EditPet = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data: pet, error } = useSWR(_id ? `/api/pets/${_id}` : null, fetcher);

  if (error) return <p>Failed to load</p>;
  if (!pet) return <p>Loading...</p>;

  const petForm = {
    name: pet.name,
    owner_name: pet.owner_name,
    species: pet.species,
    birthdate: pet.birthdate,
    potty_trained: pet.potty_trained,
    diet: pet.diet,
    image_url: pet.image_url,
    likes: pet.likes,
    dislikes: pet.dislikes,
  };

  return <Form formId="edit-pet-form" petForm={petForm} forNewPet={false} />;
};

export default EditPet;
