import { useRouter } from "next/router";
import useSWR from "swr";
import Form from "../../../components/forms/flatgroundTrick/form";

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data);

const EditFlatGroundTrick = () => {
  const router = useRouter();
  const { _id } = router.query;
  const { data: flatGroundTrick, error } = useSWR(
    _id ? `/api/flatgroundtricks/${_id}` : null,
    fetcher
  );

  if (error) return <p>Failed to load</p>;
  if (!flatGroundTrick) return <p>Loading...</p>;

  const flatGroundTrickForm = {
    name: flatGroundTrick.name,
    preferred_stance: flatGroundTrick.preferred_stance,
    stance: flatGroundTrick.stance,
    direction: flatGroundTrick.direction,
    link: flatGroundTrick.link,
    description: flatGroundTrick.likes,
    date: new Date(flatGroundTrick.date).toISOString().substring(0, 10),
    image_url: flatGroundTrick.image_url,
    landed: flatGroundTrick.landed,
  };

  return (
    <Form
      formId="edit-flatground-trick-form"
      flatGroundTrickForm={flatGroundTrickForm}
      forNewFlatGroundTrick={false}
    />
  );
};

export default EditFlatGroundTrick;
