import { useState } from 'react';
import styles from './form.module.scss';
import utilStyles from '../../styles/utils.module.scss';
import { VN } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import { signOut, useSession } from 'next-auth/react';
import Loader from '../common/Loader';
import LoaderButton from '../common/LoaderButton';
import { apiCall, baseStyle, getEventKeyValue, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from '../common/transitionScroll/TransitionScroll';

const ProfileForm = ({ profileForm }) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    preferred_stance: profileForm.preferred_stance,
  });

  const { preferred_stance } = form;

  const patchData = async (form) => {
    try {
      await apiCall('profiles/mine', { method: 'PATCH', data: form });
      toast.success('Successfully updated profile');
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  const handleChange = (e) => setForm((prevForm) => ({ ...prevForm, ...getEventKeyValue(e) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await patchData(form);
    setLoading(false);
  };

  if (!session) return <Loader />;

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
        <h1 className="text-3xl">
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
          <button
            className={`${utilStyles.button} ${utilStyles.red} mt-4`}
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out
          </button>
        </div>
      </form>
    </TransitionScroll>
  );
};

export default ProfileForm;
