import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import styles from "../form.module.scss";
import ColoredButton from "../../util/coloredButton/coloredButton";

const Form = ({ formId, petForm, forNewPet = true }) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: petForm.name,
    owner_name: petForm.owner_name,
    species: petForm.species,
    birthdate: new Date(petForm.birthdate).toISOString().substring(0, 10),
    potty_trained: petForm.potty_trained,
    diet: petForm.diet,
    image_url: petForm.image_url,
    likes: petForm.likes,
    dislikes: petForm.dislikes,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { _id } = router.query;

    try {
      const res = await fetch(`/api/pets/${_id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();

      await mutate(`/api/pets/${_id}`, data, false); // Update the local data without a revalidation
      await router.push("/");
    } catch (error) {
      setMessage("Failed to update pet");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      await router.push("/");
    } catch (error) {
      setMessage("Failed to add pet");
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    let value = target.value;

    if (target.type === "checkbox") {
      value = target.checked;
    } else if (target.type === "textarea") {
      value = value.split(",");
    }

    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.owner_name) err.owner_name = "Owner is required";
    if (!form.species) err.species = "Species is required";
    if (!form.image_url) err.image_url = "Image URL is required";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      forNewPet ? postData(form) : putData(form);
    } else {
      setErrors({ ...errs });
    }
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name
          <input
            type="text"
            maxLength="20"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Owner
          <input
            type="text"
            maxLength="20"
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Species
          <input
            type="text"
            maxLength="30"
            name="species"
            value={form.species}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Age
          <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
        </label>

        <label>
          Potty Trained
          <input
            type="checkbox"
            name="potty_trained"
            checked={form.potty_trained}
            onChange={handleChange}
          />
        </label>

        <label>
          Diet
          <textarea name="diet" maxLength="60" value={form.diet} onChange={handleChange} />
        </label>

        <label>
          Image URL
          <input
            type="url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Likes
          <textarea name="likes" maxLength="60" value={form.likes} onChange={handleChange} />
        </label>

        <label>
          Dislikes
          <textarea name="dislikes" maxLength="60" value={form.dislikes} onChange={handleChange} />
        </label>

        <p>{message}</p>

        <div className="text-red-500">
          {Object.keys(errors).map((key, index) => (
            <li key={index}>{errors[key]}</li>
          ))}
        </div>

        <ColoredButton
          type="submit"
          className={"bg-green-500 focus:ring-green-600/50 hover:bg-green-600"}
          text="Submit"
        />
      </form>
    </>
  );
};

export default Form;
