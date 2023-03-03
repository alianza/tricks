import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { capitalize, getFullGrindName, VN } from '../../lib/util';
import utilStyles from '../../styles/utils.module.scss';
import { GRINDS_ENUM } from '../../models/constants/grinds';

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

const GrindForm = ({ grindForm, newGrind = true }) => {
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [fullTrickName, setFullTrickName] = useState(null);

  const [form, setForm] = useState({
    name: grindForm.name,
    preferred_stance: grindForm.preferred_stance,
    stance: grindForm.stance,
    direction: grindForm.direction,
  });

  const { name, preferred_stance, stance, direction } = form;

  useEffect(() => {
    setFullTrickName(getFullGrindName(form));
  }, [form]);

  const patchData = async (form) => {
    const { _id } = router.query;
    try {
      const { data } = await apiCall('grinds', { method: 'PATCH', data: form, _id });
      await mutate(`/api/grinds/${_id}`, data, false); // Update the local data without a revalidation
      await router.push('/');
    } catch (error) {
      setMessage(`Failed to update grind: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      await apiCall('grinds', { method: 'POST', data: form });
      await router.push('/');
    } catch (error) {
      setMessage(`Failed to add Grind: ${error.message}`);
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
    newGrind ? postData(form) : patchData(form);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
      <h1 className="text-2xl">{newGrind ? 'New Grind' : 'Edit Grind'}</h1>

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
          Name
          <select name={VN({ name })} value={name} onChange={handleChange} required>
            {GRINDS_ENUM.map((trick) => (
              <option key={trick} value={trick}>
                {capitalize(trick)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="my-4">
        Full grind name: <b>{fullTrickName}</b>
      </p>

      <p className="my-4">{message}</p>

      <button type="submit" className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>
        Submit
      </button>
    </form>
  );
};

export default GrindForm;
