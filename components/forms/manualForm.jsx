import { useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { apiCall, capitalize, VN } from '../../lib/commonUtils';
import utilStyles from '../../styles/utils.module.scss';
import { MANUALS_ENUM } from '../../models/constants/manuals';
import { toast } from 'react-toastify';
import { useAsyncEffect } from '../../lib/clientUtils';
import LoaderButton from '../common/LoaderButton';

const ManualForm = ({ manualForm, newManual = true }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    preferred_stance: manualForm.preferred_stance,
    type: manualForm.type,
  });

  const { preferred_stance, type } = form;

  useAsyncEffect(async () => {
    if (!newManual) return;
    const { data } = await apiCall('profiles/mine/preferred_stance'); // Set the preferred stance to the user's preferred stance
    setForm((oldForm) => ({ ...oldForm, preferred_stance: data.preferred_stance }));
  }, []);

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      const { data } = await apiCall('manuals', { method: 'PATCH', data: form, _id });
      mutate(`/api/manuals/${_id}`, data, false); // Update the local data without a revalidation
      router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to update manual: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('manuals', { method: 'POST', data: form });
      mutate('/api/manuals', data, false); // Update the local data without a revalidation
      router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to add Manual: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { target } = e;
    let { value, name } = target;
    if (target.type === 'checkbox') value = target.checked;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    newManual ? await postData(form) : await patchData(form);
    setLoading(false);
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

      <label className="mb-4">
        Type
        <select name={VN({ type })} value={type} onChange={handleChange} required>
          {MANUALS_ENUM.map((manual) => (
            <option key={manual} value={manual}>
              {capitalize(manual)}
            </option>
          ))}
        </select>
      </label>

      <LoaderButton isLoading={loading} />
    </form>
  );
};

export default ManualForm;
