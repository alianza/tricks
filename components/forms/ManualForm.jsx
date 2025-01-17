import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './form.module.scss';
import { capitalize, getDateString, VN } from '../../lib/commonUtils';
import { MANUALS_ENUM } from '../../models/constants/manuals';
import { toast } from 'react-toastify';
import { useAsyncEffect, useCloseOnUrlParam } from '../../lib/customHooks';
import LoaderButton from '../common/LoaderButton';
import { apiCall, baseStyle, getEventKeyValue, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from '../common/transitionScroll/TransitionScroll';
import Show from '../common/Show';
import { PreferredStanceSelect } from './elements/PreferredStanceSelect';

/**
 * @param manual {Manual} - The Manual to edit or create
 * @param newManual {boolean} - Whether the form is for a new Manual or an existing one
 * @returns {JSX.Element} - The Manual form
 * @constructor
 */
const ManualForm = ({ manual, newManual = true }) => {
  const router = useRouter();
  const closeAfterAdd = useCloseOnUrlParam('closeAfterAdd');

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: manual.type,
    landed: manual.landed,
    landedAt: getDateString(manual.landedAt) || getDateString(),
  });

  const { preferred_stance, type, landed, landedAt } = form;

  useAsyncEffect(async () => {
    if (!newManual) return;
    const { data } = await apiCall('profiles/mine/preferred_stance'); // Set the preferred stance to the user's preferred stance
    setForm((prevForm) => ({ ...prevForm, preferred_stance: data.preferred_stance }));
  }, []);

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      await apiCall('manuals', { method: 'PATCH', data: form, _id });
      await router.back();
      toast.success(`Successfully updated manual: ${capitalize(form.type)}`);
    } catch (error) {
      toast.error(`Failed to update manual: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('manuals', { method: 'POST', data: form });
      await router.push(`/manuals/${data._id}`);
      closeAfterAdd();
      toast.success(`Successfully added manual: ${capitalize(form.type)}`);
    } catch (error) {
      toast.error(`Failed to add Manual: ${error.message}`);
    }
  };

  const handleChange = (e) => setForm((prevForm) => ({ ...prevForm, ...getEventKeyValue(e) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form };
    if (!landed) data.landedAt = null;
    newManual ? await postData(data) : await patchData(data);
    setLoading(false);
  };

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
        <h1 className="text-3xl">{newManual ? 'New Manual' : 'Edit Manual'}</h1>

        <PreferredStanceSelect preferredStance={preferred_stance} onChange={handleChange} />

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

        <label title="Did you land this trick?">
          <input
            type="checkbox"
            name={VN({ landed })}
            checked={landed}
            onChange={handleChange}
            className="size-4 align-middle"
          />
          <span className="ml-2 align-middle">Landed</span>
        </label>
        <Show if={landed}>
          <label>
            Date Landed
            <input type="date" max={getDateString()} name={VN({ landedAt })} value={landedAt} onChange={handleChange} />
          </label>
        </Show>

        <LoaderButton isLoading={loading} label={`${newManual ? 'Create' : 'Update'} Manual`} />
      </form>
    </TransitionScroll>
  );
};

export default ManualForm;
