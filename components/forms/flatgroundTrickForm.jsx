import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './form.module.scss';
import { capitalize, getFullTrickName, VN } from '../../lib/commonUtils';
import { FLATGROUND_TRICKS_ENUM } from '../../models/constants/flatgroundTricks';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'react-toastify';
import { useAsyncEffect } from '../../lib/customHooks';
import LoaderButton from '../common/LoaderButton';
import { mutate } from 'swr';
import { apiCall } from '../../lib/clientUtils';

const FlatgroundTrickForm = ({ flatgroundTrick, newFlatgroundTrick = true }) => {
  const router = useRouter();

  const [fullTrickName, setFullTrickName] = useState(null);
  const [trickNameRef] = useAutoAnimate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: flatgroundTrick.name,
    preferred_stance: flatgroundTrick.preferred_stance,
    stance: flatgroundTrick.stance,
    direction: flatgroundTrick.direction,
    rotation: flatgroundTrick.rotation,
  });

  const { name, preferred_stance, stance, direction, rotation } = form;

  useAsyncEffect(async () => {
    if (!newFlatgroundTrick) return;
    const { data } = await apiCall('profiles/mine/preferred_stance'); // Set the preferred stance to the user's preferred stance
    setForm((oldForm) => ({ ...oldForm, preferred_stance: data.preferred_stance }));
  }, []);

  useEffect(() => {
    setFullTrickName(getFullTrickName(form));
  }, [form]);

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      const { data } = await apiCall('flatgroundtricks', { _id, method: 'PATCH', data: form });
      mutate(`/api/flatgroundtricks/${_id}`, data, false); // Update the local data without a revalidation
      router.back();
    } catch (error) {
      toast.error(`Failed to update flatground trick: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('flatgroundtricks', { method: 'POST', data: form });
      mutate('/api/flatgroundtricks', data, false); // Update the local data without a revalidation
      router.back();
    } catch (error) {
      toast.error(`Failed to add flatground trick: ${error.message}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    newFlatgroundTrick ? await postData(form) : await patchData(form);
    setLoading(false);
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
        Full trick name:{' '}
        <b ref={trickNameRef}>
          {fullTrickName?.split('').map((letter, index) => (
            <span key={index} className="inline-block whitespace-pre">
              {letter}
            </span>
          ))}
        </b>
      </p>
      <LoaderButton isLoading={loading} />
    </form>
  );
};

export default FlatgroundTrickForm;
