import { useState } from "react";
import { useRouter } from "next/router";
import { mutate } from "swr";
import styles from "../form.module.scss";
import { VN } from "../../../lib/util";
import utilStyles from "../../../styles/utils.module.scss";

const Form = ({ formId, flatgroundTrickForm, forNewFlatgroundTrick = true }) => {
  const router = useRouter();
  const contentType = "application/json";
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: flatgroundTrickForm.name,
    preferred_stance: flatgroundTrickForm.preferred_stance,
    stance: flatgroundTrickForm.stance,
    direction: flatgroundTrickForm.direction,
    link: flatgroundTrickForm.link,
    description: flatgroundTrickForm.description,
    date: new Date(flatgroundTrickForm.date).toISOString().substring(0, 10),
    image_url: flatgroundTrickForm.image_url,
    landed: !!flatgroundTrickForm.landed,
  });

  const { name, preferred_stance, stance, direction, link, description, date, image_url, landed } = form;

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
      setMessage("Failed to add flatgroundTrick");
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    let { value, name } = target;

    if (target.type === "checkbox") {
      value = target.checked;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  // /* Makes sure info is filled in*/
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
    forNewFlatgroundTrick ? postData(form) : putData(form);
    // } else {
    //   setErrors({ ...errs });
    // }
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name
          <input type="text" maxLength="20" name={VN({ name })} value={name} onChange={handleChange} required />
        </label>

        <label>
          Preferred stance
          <select name={VN({ preferred_stance })} value={preferred_stance} onChange={handleChange} required>
            <option value="regular">Regular</option>
            <option value="goofy">Goofy</option>
          </select>
        </label>

        <label>
          Stance
          <select name={VN({ stance })} value={stance} onChange={handleChange} required>
            <option value="regular">Regular</option>
            <option value="fakie">Fakie</option>
            <option value="switch">Switch</option>
            <option value="nollie">Nollie</option>
          </select>
        </label>

        <label>
          Direction
          <select name={VN({ direction })} value={direction} onChange={handleChange}>
            <option selected value="none">
              None
            </option>
            <option value="frontside">Frontside</option>
            <option value="backside">Backside</option>
          </select>
        </label>

        <label>
          Description
          <textarea name={VN({ description })} value={description} onChange={handleChange} />
        </label>

        <label>
          Date
          <input type="date" name={VN({ date })} value={date} onChange={handleChange} />
        </label>

        <label>
          Landed
          <input type="checkbox" name={VN({ landed })} checked={!!landed} onChange={handleChange} />
        </label>

        <label>
          Image URL
          <input type="url" name={VN({ image_url })} value={image_url} onChange={handleChange} />
        </label>

        <label>
          Link
          <input type="url" name={VN({ link })} value={link} onChange={handleChange} required />
        </label>

        <p className="my-4">{message}</p>

        <div className="text-red-500">
          {Object.keys(errors).map((key, index) => (
            <li key={index}>{errors[key]}</li>
          ))}
        </div>

        <button
          type="submit"
          className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Form;
