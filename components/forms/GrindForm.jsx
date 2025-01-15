import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './form.module.scss';
import { capitalize, getDateString, getFullGrindName, VN } from '../../lib/commonUtils';
import { GRINDS_ENUM } from '../../models/constants/grinds';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'react-toastify';
import { useAsyncEffect, useCloseOnUrlParam } from '../../lib/customHooks';
import LoaderButton from '../common/LoaderButton';
import { apiCall, baseStyle, getEventKeyValue, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from '../common/transitionScroll/TransitionScroll';
import AddAnotherCheckBox from '../common/AddAnotherCheckBox';
import { newGrindObj } from '../../pages/new-grind';
import Show from '../common/Show';
import { PreferredStanceSelect } from './elements/PreferredStanceSelect';

/**
 * @param grind {Grind} - The Grind to edit or create
 * @param newGrind {boolean} - Whether the form is for a new Grind or an existing one
 * @returns {JSX.Element} - The Grind form
 */

function GrindForm({ grind, newGrind = true }) {
  const router = useRouter();
  const closeAfterAdd = useCloseOnUrlParam('closeAfterAdd');

  const [fullTrickName, setFullTrickName] = useState(null);
  const [trickNameRef] = useAutoAnimate();
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [form, setForm] = useState({
    name: grind.name,
    stance: grind.stance,
    direction: grind.direction,
    landed: grind.landed,
    landedAt: getDateString(grind.landedAt) || getDateString(),
  });

  const { name, preferred_stance, stance, direction, landed, landedAt } = form;

  useAsyncEffect(async () => {
    if (!newGrind) return;
    const { data } = await apiCall('profiles/mine/preferred_stance'); // Set the preferred stance to the user's preferred stance
    setForm((prevForm) => ({ ...prevForm, preferred_stance: data.preferred_stance }));
  }, []);

  useEffect(() => {
    setFullTrickName(getFullGrindName(form));
  }, [form]);

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      await apiCall('grinds', { method: 'PATCH', data: form, _id });
      await router.back();
      toast.success(`Successfully updated grind: ${getFullGrindName(form)}`);
    } catch (error) {
      toast.error(`Failed to update grind: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('grinds', { method: 'POST', data: form });
      if (addAnother) {
        setForm(newGrindObj);
      } else {
        await router.push(`/grinds/${data._id}`);
      }
      closeAfterAdd();
      toast.success(`Successfully added grind: ${getFullGrindName(form)}`);
    } catch (error) {
      toast.error(`Failed to add grind: ${error.message}`);
    }
  };

  const handleChange = (e) => setForm((prevForm) => ({ ...prevForm, ...getEventKeyValue(e) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form };
    if (!landed) data.landedAt = null;
    newGrind ? await postData(data) : await patchData(data);
    setLoading(false);
  };

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
        <h1 className="text-3xl">{newGrind ? 'New Grind' : 'Edit Grind'}</h1>

        <PreferredStanceSelect preferredStance={preferred_stance} onChange={handleChange} />

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

        <p>
          Full grind name:{' '}
          <b ref={trickNameRef}>
            {fullTrickName?.split('').map((letter, index) => (
              <span key={index} className="inline-block whitespace-pre">
                {letter}
              </span>
            ))}
          </b>
        </p>

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

        <div className="flex items-center justify-start gap-4">
          <LoaderButton isLoading={loading} label={`${newGrind ? 'Create' : 'Update'} Grind`} />
          {newGrind && (
            <AddAnotherCheckBox checked={addAnother} onChange={({ target }) => setAddAnother(target.checked)} />
          )}
        </div>
      </form>
    </TransitionScroll>
  );
}

export default GrindForm;
