import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import styles from "../form.module.scss";
import ColoredButton from "../../util/coloredButton/coloredButton";

const Form = ({ formId, flatGroundTrickForm, forNewFlatGroundTrick = true }) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: flatGroundTrickForm.name,
    preferred_stance: flatGroundTrickForm.preferred_stance,
    stance: flatGroundTrickForm.stance,
    direction: flatGroundTrickForm.direction,
    link: flatGroundTrickForm.link,
    description: flatGroundTrickForm.description,
    date: new Date(flatGroundTrickForm.date).toISOString().substring(0, 10),
    image_url: flatGroundTrickForm.image_url,
    landed: !!flatGroundTrickForm.landed,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { _id } = router.query;

    try {
      const res = await fetch(`/api/flatgroundtricks/${_id}`, {
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

      await mutate(`/api/flatgroundtricks/${_id}`, data, false); // Update the local data without a revalidation
      await router.push("/");
    } catch (error) {
      setMessage("Failed to update flatground trick");
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch("/api/flatgroundtricks", {
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
      setMessage("Failed to add platGroundTrick");
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    let { value, name } = target;

    if (target.type === "checkbox") {
      value = target.checked;
    } else if (target.type === "textarea") {
      value = value.split(",");
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  // /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  // const formValidate = () => {
  //   let err = {};
  //   if (!form.name) err.name = "Name is required";
  //   if (!form.owner_name) err.owner_name = "Owner is required";
  //   if (!form.species) err.species = "Species is required";
  //   if (!form.image_url) err.image_url = "Image URL is required";
  //   return err;
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const errs = formValidate();
    // if (Object.keys(errs).length === 0) {
    forNewFlatGroundTrick ? postData(form) : putData(form);
    // } else {
    //   setErrors({ ...errs });
    // }
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
          Preferred stance
          <select
            name="preferred_stance"
            value={form.preferred_stance}
            onChange={handleChange}
            required
          >
            <option value="regular">Regular</option>
            <option value="goofy">Goofy</option>
          </select>
        </label>

        <label>
          Stance
          <select name="stance" value={form.stance} onChange={handleChange} required>
            <option value="regular">Regular</option>
            <option value="fakie">Fakie</option>
            <option value="switch">Switch</option>
            <option value="nollie">Nollie</option>
          </select>
        </label>

        <label>
          Direction
          <select name="direction" value={form.direction} onChange={handleChange}>
            <option selected value="none">
              None
            </option>
            <option value="frontside">Frontside</option>
            <option value="backside">Backside</option>
          </select>
        </label>

        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </label>

        <label>
          Landed
          <input type="checkbox" name="landed" checked={!!form.landed} onChange={handleChange} />
        </label>

        <label>
          Image URL
          <input type="url" name="image_url" value={form.image_url} onChange={handleChange} />
        </label>

        <label>
          Link
          <input type="url" name="link" value={form.link} onChange={handleChange} required />
        </label>

        <p className="my-4">{message}</p>

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
