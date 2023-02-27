import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { capitalize, getFullTrickName, VN } from '../../lib/util';
import utilStyles from '../../styles/utils.module.scss';
import { FLATGROUND_TRICKS_ENUM } from '../../models/constants/flatgroundTricks';

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

const FlatgroundTrickForm = ({ flatgroundTrickForm, newFlatgroundTrick = true }) => {
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [fullTrickName, setFullTrickName] = useState(null);

  const [form, setForm] = useState({
    name: flatgroundTrickForm.name,
    preferred_stance: flatgroundTrickForm.preferred_stance,
    stance: flatgroundTrickForm.stance,
    direction: flatgroundTrickForm.direction,
    rotation: flatgroundTrickForm.rotation,
  });

  const { name, preferred_stance, stance, direction, rotation } = form;

  useEffect(() => {
    setFullTrickName(getFullTrickName(form));
  }, [form]);

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
    <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
      <h1 className="text-2xl">{newFlatgroundTrick ? 'New Flatground Trick' : 'Edit Flatground Trick'}</h1>

      <label>
        Preferred stance
        <select name={VN({ preferred_stance })} value={preferred_stance} onChange={handleChange} required>
          <option value="regular">Regular</option>
          <option value="goofy">Goofy</option>
        </select>
      </label>

      <div className="flex justify-between gap-1">
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
            <option value="none">-</option>
            <option value="frontside">Frontside</option>
            <option value="backside">Backside</option>
          </select>
        </label>

        <label>
          Rotation
          <select name={VN({ rotation })} value={rotation} onChange={handleChange} required>
            <option value={0}>-</option>
            <option value={180}>180</option>
            <option value={360}>360</option>
            <option value={540}>540</option>
            <option value={720}>720</option>
          </select>
        </label>

        <label>
          Name
          <select name={VN({ name })} value={name} onChange={handleChange} required>
            {FLATGROUND_TRICKS_ENUM.map((trick) => (
              <option key={trick} value={trick}>
                {capitalize(trick)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/*<label>*/}
      {/*  Date*/}
      {/*  <input type="date" name={VN({date})} value={date} onChange={handleChange} />*/}
      {/*</label>*/}

      <p className="my-4">
        Full trick name: <b>{fullTrickName}</b>
      </p>

      <p className="my-4">{message}</p>

      <button type="submit" className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>
        Submit
      </button>
    </form>
  );
};

export default FlatgroundTrickForm;
