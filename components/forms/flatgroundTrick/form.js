import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from '../form.module.scss';
import { capitalize, VN } from '../../../lib/util';
import utilStyles from '../../../styles/utils.module.scss';
import FLATGROUND_TRICKS from '../../../models/constants/flatgroundTricks';

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

const Form = ({ flatgroundTrickForm, newFlatgroundTrick = true }) => {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: flatgroundTrickForm.name,
    preferred_stance: flatgroundTrickForm.preferred_stance,
    stance: flatgroundTrickForm.stance,
    direction: flatgroundTrickForm.direction,
    rotation: flatgroundTrickForm.rotation,
    link: flatgroundTrickForm.link,
    date: new Date(flatgroundTrickForm.date).toISOString().substring(0, 10),
    image_url: flatgroundTrickForm.image_url,
  });

  const { name, preferred_stance, stance, direction, rotation, link, date, image_url } = form;

  /* The PATCH method edits an existing entry in the mongodb database. */
  const patchData = async (form) => {
    const { _id } = router.query;

    try {
      const res = await fetch(`/api/flatgroundtricks/${_id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const { data } = await res.json();

      await mutate(`/api/flatgroundtricks/${_id}`, data, false); // Update the local data without a revalidation
      await router.push('/');
    } catch (error) {
      setMessage(`Failed to update flatground trick: ${error.message}`);
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/flatgroundtricks', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      await router.push('/');
    } catch (error) {
      setMessage(`Failed to add flatground trick: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    let { value, name } = target;

    if (target.type === 'checkbox') {
      value = target.checked;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    newFlatgroundTrick ? postData(form) : patchData(form);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Preferred stance
          <select name={VN({ preferred_stance })} value={preferred_stance} onChange={handleChange} required>
            <option value="regular">Regular</option>
            <option value="goofy">Goofy</option>
          </select>
        </label>

        <div className="flex justify-between">
          <label>
            Stance
            <select name={VN({ stance })} value={stance} onChange={handleChange} required>
              <option value="regular">-</option>
              <option value="fakie">Fakie</option>
              <option value="switch">Switch</option>
              <option value="nollie">Nollie</option>
            </select>
          </label>

          <label>
            Direction
            <select name={VN({ direction })} value={direction} onChange={handleChange}>
              <option selected value="none">
                -
              </option>
              <option value="frontside">Frontside</option>
              <option value="backside">Backside</option>
            </select>
          </label>

          <label>
            Rotation
            <select name={VN({ rotation })} value={rotation} onChange={handleChange} required>
              <option value="0">-</option>
              <option value="180">180</option>
              <option value="360">360</option>
              <option value="540">540</option>
              <option value="720">720</option>
            </select>
          </label>

          <label>
            Name
            <select name={VN({ name })} value={name} onChange={handleChange} required>
              {FLATGROUND_TRICKS.map((trick) => (
                <option key={trick} value={trick}>
                  {capitalize(trick)}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        {/*<label>*/}
        {/*  Date*/}
        {/*  <input type="date" name={VN({date})} value={date} onChange={handleChange} />*/}
        {/*</label>*/}

        <label>
          Image URL
          <input type="url" name={VN({ image_url })} value={image_url} onChange={handleChange} />
        </label>

        {/*<label>*/}
        {/*  Link*/}
        {/*  <input type="url" name={VN({link})} value={link} onChange={handleChange} required />*/}
        {/*</label>*/}

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
