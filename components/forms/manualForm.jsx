import { useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { apiCall, capitalize, VN } from '../../lib/util';
import utilStyles from '../../styles/utils.module.scss';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { MANUALS_ENUM } from '../../models/constants/manuals';

const ManualForm = ({ manualForm, newManual = true }) => {
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [fullTrickName, setFullTrickName] = useState(null);
  const [trickNameRef] = useAutoAnimate();

  const [form, setForm] = useState({
    preferred_stance: manualForm.preferred_stance,
    type: manualForm.type,
  });

  const { preferred_stance, type } = form;

  // useEffect(() => {
  //   setFullTrickName(getFullManualName(form));
  // }, [form]);

  const patchData = async (form) => {
    const { _id } = router.query;
    try {
      const { data } = await apiCall('manuals', { method: 'PATCH', data: form, _id });
      await mutate(`/api/manuals/${_id}`, data, false); // Update the local data without a revalidation
      await router.push('/');
    } catch (error) {
      setMessage(`Failed to update manual: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      await apiCall('manuals', { method: 'POST', data: form });
      await router.push('/');
    } catch (error) {
      setMessage(`Failed to add Manual: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    let { value, name } = target;
    if (target.type === 'checkbox') value = target.checked;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    newManual ? postData(form) : patchData(form);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
      <h1 className="text-2xl">{newManual ? 'New Manual' : 'Edit Manual'}</h1>

      <label>
        Preferred stance
        <select name={VN({ preferred_stance })} value={preferred_stance} onChange={handleChange} required>
          <option value="regular">Regular</option>
          <option value="goofy">Goofy</option>
        </select>
      </label>

      <div className="flex justify-between gap-1">
        <label>
          Type
          <select name={VN({ type })} value={type} onChange={handleChange} required>
            {MANUALS_ENUM.map((manual) => (
              <option key={manual} value={manual}>
                {capitalize(manual)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="my-4">
        Full manual name:{' '}
        <b ref={trickNameRef}>
          {fullTrickName?.split('').map((letter, index) => (
            <span key={index} className="inline-block whitespace-pre">
              {letter}
            </span>
          ))}
        </b>
      </p>

      <p className="my-4">{message}</p>

      <button type="submit" className={`${utilStyles.button} bg-green-500 hover:bg-green-600 focus:ring-green-600/50`}>
        Submit
      </button>
    </form>
  );
};

export default ManualForm;
