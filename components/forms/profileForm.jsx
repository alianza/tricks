import { useState } from 'react';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { apiCall, VN } from '../../lib/commonUtils';
import utilStyles from '../../styles/utils.module.scss';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Loader from '../common/loader/loader';

const ProfileForm = ({ profileForm }) => {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    preferred_stance: profileForm.preferred_stance,
  });

  const { preferred_stance } = form;

  const patchData = async (form) => {
    try {
      console.log(`form`, form);
      const { data } = await apiCall('profiles/mine', { method: 'PATCH', data: form });
      await mutate(`/api/profiles/mine`, data, false); // Update the local data without a revalidation
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
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
    patchData(form);
  };

  if (!session) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
      <h1 className="text-2xl">
        Hello <i>{session.user?.name}</i>!
      </h1>
      <p>Here you can change your profile settings.</p>

      <label>
        Preferred stance
        <select name={VN({ preferred_stance })} value={preferred_stance} onChange={handleChange} required>
          <option value="regular">Regular</option>
          <option value="goofy">Goofy</option>
        </select>
      </label>

      <button
        type="submit"
        className={`${utilStyles.button} mt-4 bg-green-500 hover:bg-green-600 focus:ring-green-600/50`}
      >
        Submit
      </button>
    </form>
  );
};

export default ProfileForm;
