import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { apiCall, capitalize, VN } from '../../lib/commonUtils';
import utilStyles from '../../styles/utils.module.scss';
import { ArrowPathIcon, ArrowRightIcon, ArrowUturnLeftIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'react-toastify';
import { useAsyncEffect } from '../../lib/clientUtils';
import LoaderButton from '../common/LoaderButton';

export const TRICK_TYPES_MAP = {
  flatgroundtricks: 'Flatground Tricks',
  grinds: 'Grinds',
  manuals: 'Manuals',
};

const TRICK_TYPES = Object.values(TRICK_TYPES_MAP);

const TRICK_TYPES_ENDPOINTS = {
  [TRICK_TYPES_MAP.flatgroundtricks]: 'flatgroundtricks',
  [TRICK_TYPES_MAP.grinds]: 'grinds',
  [TRICK_TYPES_MAP.manuals]: 'manuals',
};

export const TRICK_TYPES_MODELS = {
  [TRICK_TYPES_MAP.flatgroundtricks]: 'FlatgroundTrick',
  [TRICK_TYPES_MAP.grinds]: 'Grind',
  [TRICK_TYPES_MAP.manuals]: 'Manual',
};

const trickTypeHasStance = (trickType) =>
  trickType === TRICK_TYPES_MAP.flatgroundtricks || trickType === TRICK_TYPES_MAP.grinds;

const ComboForm = ({ comboForm, newCombo = true }) => {
  const router = useRouter();

  const [trickType, setTrickType] = useState(TRICK_TYPES_MAP.flatgroundtricks);
  const [tricks, setTricks] = useState(TRICK_TYPES.reduce((acc, trickType) => ({ ...acc, [trickType]: [] }), {})); // Fill tricks with empty arrays for each trick type
  const [stance, setStance] = useState('all');
  const [loading, setLoading] = useState(true);
  const [trickArrayRef] = useAutoAnimate();
  const [tricksRef] = useAutoAnimate();
  const [form, setForm] = useState({ trickArray: comboForm.trickArray });

  const { trickArray } = form;

  useAsyncEffect(async () => {
    for (const trickType of TRICK_TYPES) await fetchTrickType(trickType); // Fetch all trick types
  }, []);

  useEffect(() => {
    if (trickTypeHasStance(trickType)) return;
    setStance('all'); // Set stances to all if trick type is manuals (Manuals don't have a stance)
  }, [trickType]);

  const fetchTrickType = async (trickType) => {
    try {
      setLoading(true);
      const { data } = await apiCall(TRICK_TYPES_ENDPOINTS[trickType], { method: 'GET' });
      setTricks((previousTricks) => ({ ...previousTricks, [trickType]: data }));
    } catch (error) {
      toast.error(`Failed to fetch ${trickType}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      const { data } = await apiCall('combos', { method: 'PATCH', _id, data: trimTrickArray(form) });
      await mutate(`/api/combos/${_id}`, data, false); // Update the local data without a revalidation
      await router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to update combo: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('combos', {
        method: 'POST',
        data: { ...form, trickArray: trickArray.map(({ _id, trickRef }) => ({ trick: _id, trickRef })) },
      });
      await mutate('/api/combos', data, false); // Update the local data without a revalidation
      await router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to create combo: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    newCombo ? await postData(form) : await patchData(form);
    setLoading(false);
  };

  const addTrick = (e, trick) => {
    e.preventDefault();
    setForm({ ...form, trickArray: [...trickArray, { ...trick, trickRef: TRICK_TYPES_MODELS[trickType] }] }); // Add trick to trickArray, and add trickRef to trick
  };

  const stanceFilter = (trick) => (stance === 'all' ? true : trick.stance === stance);

  return (
    <div className="flex grow flex-col justify-center xsm:min-w-[240px]">
      <div ref={trickArrayRef} className="relative flex flex-wrap gap-2">
        {trickArray.map((trick, index) => (
          <div key={trick._id + index} className="flex gap-2">
            <span className="whitespace-nowrap font-bold">{trick.trick}</span>
            {trickArray[index + 1] ? (
              <ArrowRightIcon title="To" className="h-6 w-6" />
            ) : (
              trick.trickRef === TRICK_TYPES_MODELS[TRICK_TYPES_MAP.flatgroundtricks] &&
              trickArray.length > 1 && <span className="font-bold"> Out </span>
            )}
            {trickArray.length === 1 && (
              <span className="font-bold">
                <ArrowRightIcon title="To" className="mr-1 inline-block h-6 w-6" />
                ...
              </span>
            )}
          </div>
        ))}
        {!trickArray.length && <span className="whitespace-nowrap font-bold">Combo Name...</span>}
      </div>
      <hr className="my-2 border-neutral-800 dark:border-neutral-400" />

      <form onSubmit={handleSubmit} className={`${styles.form} mt-6 flex grow flex-col`}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{newCombo ? 'New Combo' : 'Edit Combo'}</h1>
          {trickArray.length > 0 && (
            <ArrowUturnLeftIcon
              title="Remove last trick"
              className="h-6 w-6 cursor-pointer transition-transform hover:scale-110 active:scale-95 active:duration-75"
              onClick={() => setForm({ ...form, trickArray: trickArray.slice(0, -1) })}
            />
          )}
        </div>

        <label>
          Select type of trick to add
          <select name={VN({ trickType })} value={trickType} onChange={({ target }) => setTrickType(target.value)}>
            {Object.keys(TRICK_TYPES_ENDPOINTS).map((trickType) => (
              <option key={trickType} value={trickType}>
                {capitalize(trickType)}
              </option>
            ))}
          </select>
        </label>

        {trickTypeHasStance(trickType) && (
          <div className="mt-2">
            <select name={VN({ stance })} value={stance} onChange={({ target }) => setStance(target.value)} required>
              <option value="all">All Stances</option>
              <option value="regular">Regular</option>
              <option value="fakie">Fakie</option>
              <option value="switch">Switch</option>
              <option value="nollie">Nollie</option>
            </select>
          </div>
        )}

        <div ref={tricksRef} className="mt-4 flex max-h-[40vh] flex-col justify-start gap-2 overflow-hidden">
          {!tricks[trickType].filter(stanceFilter).length && !loading ? (
            <p>
              No {stance !== 'all' && stance} {trickType}...
            </p>
          ) : (
            tricks[trickType].filter(stanceFilter).map((trick) => (
              <div className="group flex cursor-pointer items-center" onClick={(e) => addTrick(e, trick)}>
                <PlusIcon className="h-6 w-6 shrink-0 transition-transform group-hover:scale-125 group-hover:duration-100 group-active:scale-95" />
                <span className={`${utilStyles.link} grow py-1`}>{trick.trick}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <LoaderButton isLoading={loading} />

          <ArrowPathIcon
            className="h-6 w-6 cursor-pointer transition-transform hover:scale-110 active:scale-95 active:duration-75"
            title="Reload tricks"
            onClick={async () => await fetchTrickType(trickType)}
          />
        </div>
      </form>
    </div>
  );
};

export default ComboForm;
