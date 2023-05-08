import { useState } from 'react';
import { mutate } from 'swr';
import styles from './form.module.scss';
import utilStyles from '../../styles/utils.module.scss';
import { VN } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import Loader from '../common/loader/loader';
import LoaderButton from '../common/LoaderButton';
import { apiCall } from '../../lib/clientUtils';

const ProfileForm = ({ profileForm }) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    preferred_stance: profileForm.preferred_stance,
  });

  const { preferred_stance } = form;

  const patchData = async (form) => {
    try {
      const { data } = await apiCall('profiles/mine', { method: 'PATCH', data: form });
      mutate(`/api/profiles/mine`, data, false); // Update the local data without a revalidation
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
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
    setLoading(true);
    e.preventDefault();
    await patchData(form);
    setLoading(false);
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
        <p className="text-xs font-normal text-neutral-600 dark:text-neutral-300">
          This is the default preferred stance that will be pre-filled when creating new tricks automatically!
        </p>
        <select name={VN({ preferred_stance })} value={preferred_stance} onChange={handleChange} required>
          <option value="regular">Regular</option>
          <option value="goofy">Goofy</option>
        </select>
      </label>

      <div className="flex justify-between">
        <LoaderButton isLoading={loading} className="mt-4" />
        <button className={`${utilStyles.button} ${utilStyles.red} mt-4`} onClick={() => signOut({ callbackUrl: '/' })}>
          Sign Out
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
