import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './form.module.scss';
import { capitalize, getDateString, getFullTrickName, VN } from '../../lib/commonUtils';
import { DIRECTIONS, FLATGROUND_TRICKS_ENUM } from '../../models/constants/flatgroundTricks';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'react-toastify';
import { useAsyncEffect, useCloseOnUrlParam } from '../../lib/customHooks';
import LoaderButton from '../common/LoaderButton';
import { apiCall, baseStyle, getEventNameValue, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from '../common/transitionScroll/TransitionScroll';
import AddAnotherCheckBox from '../common/AddAnotherCheckBox';
import { newFlatgroundTrickObj } from '../../pages/new-flatground-trick';
import Show from '../common/Show';
import { PreferredStanceSelect } from './elements/PreferredStanceSelect';
import '../../lib/Types';

/**
 * @param flatgroundTrick {FlatgroundTrick} - The Flatground Trick to edit or create
 * @param newFlatgroundTrick {boolean} - Whether the form is for a new Flatground Trick or an existing one
 * @returns {JSX.Element} - The Flatground Trick form
 */

const FlatgroundTrickForm = ({ flatgroundTrick, newFlatgroundTrick = true }) => {
  const router = useRouter();
  const closeAfterAdd = useCloseOnUrlParam('closeAfterAdd');

  const [fullTrickName, setFullTrickName] = useState(null);
  const [trickNameRef] = useAutoAnimate();
  const [loading, setLoading] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [form, setForm] = useState({
    name: flatgroundTrick.name,
    stance: flatgroundTrick.stance,
    direction: flatgroundTrick.direction,
    rotation: flatgroundTrick.rotation,
    landed: flatgroundTrick.landed,
    landedAt: getDateString(flatgroundTrick.landedAt) || getDateString(),
  });

  const { name, preferred_stance, stance, direction, rotation, landed, landedAt } = form;

  useAsyncEffect(async () => {
    if (!newFlatgroundTrick) return;
    const { data } = await apiCall('profiles/mine/preferred_stance'); // Set the preferred stance to the user's preferred stance
    setForm((prevForm) => ({ ...prevForm, preferred_stance: data.preferred_stance }));
  }, []);

  useEffect(() => {
    setFullTrickName(getFullTrickName(form));
  }, [form]);

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      await apiCall('flatgroundtricks', { _id, method: 'PATCH', data: form });
      await router.back();
      toast.success(`Successfully updated Flatground Trick: ${getFullTrickName(form)}`);
    } catch (error) {
      toast.error(`Failed to update Flatground Trick: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('flatgroundtricks', { method: 'POST', data: form });
      if (addAnother) {
        setForm(newFlatgroundTrickObj);
      } else {
        await router.push(`/flatgroundtricks/${data._id}`);
      }
      closeAfterAdd();
      toast.success(`Successfully added Flatground Trick: ${getFullTrickName(form)}`);
    } catch (error) {
      toast.error(`Failed to add Flatground Trick: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = getEventNameValue(e);

    if (name === VN({ direction })) {
      setForm((prevForm) => ({ ...prevForm, [name]: value, [VN({ rotation })]: value === DIRECTIONS.none ? 0 : 180 })); // Set rotation to 180 if direction is not none, and unset it if it is
    }

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form };
    if (!landed) data.landedAt = null;
    newFlatgroundTrick ? await postData(data) : await patchData(data);
    setLoading(false);
  };

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <form onSubmit={handleSubmit} className={`${styles.form} max-w-xl`}>
        <h1 className="text-3xl">{newFlatgroundTrick ? 'New Flatground Trick' : 'Edit Flatground Trick'}</h1>

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
          <LoaderButton isLoading={loading} label={`${newFlatgroundTrick ? 'Create' : 'Update'} Flatground Trick`} />
          {newFlatgroundTrick && (
            <AddAnotherCheckBox checked={addAnother} onChange={({ target }) => setAddAnother(target.checked)} />
          )}
        </div>
      </form>
    </TransitionScroll>
  );
};

export default FlatgroundTrickForm;
