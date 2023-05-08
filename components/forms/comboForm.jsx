import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import formStyles from './form.module.scss';
import { capitalize, VN } from '../../lib/commonUtils';
import utilStyles from '../../styles/utils.module.scss';
import { ArrowPathIcon, ArrowRightIcon, ArrowUturnLeftIcon, PlusIcon } from '@heroicons/react/20/solid';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'react-toastify';
import { useAsyncEffect, useCloseOnUrlParam } from '../../lib/customHooks';
import LoaderButton from '../common/LoaderButton';
import { apiCall } from '../../lib/clientUtils';
import Link from 'next/link';

export const TRICK_TYPES_MAP = { flatground: 'Flatground Tricks', grind: 'Grinds', manual: 'Manuals' };

const TRICK_TYPES = Object.values(TRICK_TYPES_MAP);

const TRICK_TYPES_ENDPOINTS = {
  [TRICK_TYPES_MAP.flatground]: 'flatgroundtricks',
  [TRICK_TYPES_MAP.grind]: 'grinds',
  [TRICK_TYPES_MAP.manual]: 'manuals',
};

export const TRICK_TYPES_MODELS = {
  [TRICK_TYPES_MAP.flatground]: 'FlatgroundTrick',
  [TRICK_TYPES_MAP.grind]: 'Grind',
  [TRICK_TYPES_MAP.manual]: 'Manual',
};

export const TRICK_TYPES_NEW_PAGES = {
  [TRICK_TYPES_MAP.flatground]: '/new-flatground-trick?closeAfterAdd=true',
  [TRICK_TYPES_MAP.grind]: '/new-grind?closeAfterAdd=true',
  [TRICK_TYPES_MAP.manual]: '/new-manual?closeAfterAdd=true',
};

const trickTypeHasStance = (trickType) =>
  trickType === TRICK_TYPES_MAP.flatground || trickType === TRICK_TYPES_MAP.grind;

const ComboForm = ({ combo, newCombo = true }) => {
  const router = useRouter();
  const closeAfterAdd = useCloseOnUrlParam('closeAfterAdd');

  const [trickType, setTrickType] = useState(TRICK_TYPES_MAP.flatground);
  const [tricks, setTricks] = useState(TRICK_TYPES.reduce((acc, trickType) => ({ ...acc, [trickType]: [] }), {})); // Fill tricks with empty arrays for each trick type
  const [stance, setStance] = useState('all');
  const [loading, setLoading] = useState(true);
  const [trickArrayRef] = useAutoAnimate();
  const [tricksRef] = useAutoAnimate();
  const [form, setForm] = useState({ trickArray: combo.trickArray });

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
      const { data } = await apiCall('combos', {
        method: 'PATCH',
        _id,
        data: { ...form, trickArray: trickArray.map(({ _id, trickRef }) => ({ trick: _id, trickRef })) },
      });
      mutate(`/api/combos/${_id}`, data, false); // Update the local data without a revalidation
      router.back();
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
      mutate('/api/combos', data, false); // Update the local data without a revalidation
      router.back();
      closeAfterAdd();
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
      <h1 className="text-3xl">{newCombo ? 'New Combo' : 'Edit Combo'}</h1>

      {/*Trick name*/}
      <div ref={trickArrayRef} className="relative mt-4 flex flex-wrap gap-2">
        {trickArray.map((trick, index) => (
          <div key={trick._id + index} className="flex gap-2">
            <span className="whitespace-nowrap font-bold">{trick.trick}</span>
            {trickArray[index + 1] ? (
              <ArrowRightIcon title="To" className="h-6 w-6" />
            ) : (
              trick.trickRef === TRICK_TYPES_MODELS[TRICK_TYPES_MAP.flatground] &&
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

      <form onSubmit={handleSubmit} className={`${formStyles.form} flex grow flex-col`}>
        <div className="flex items-center justify-between">
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

        {/*Show tricks*/}
        <div
          ref={tricksRef}
          className="mt-4 flex max-h-[40vh] flex-col justify-start gap-2 overflow-y-auto overflow-x-hidden"
        >
          {!tricks[trickType].filter(stanceFilter).length && !loading ? (
            <p>
              No {stance !== 'all' && stance} {trickType}...
            </p>
          ) : (
            tricks[trickType].filter(stanceFilter).map((trick) => (
              <div
                className="group flex cursor-pointer items-center"
                onClick={(e) => addTrick(e, trick)}
                key={trick._id}
              >
                <PlusIcon className="h-6 w-6 shrink-0 transition-transform group-hover:scale-125 group-hover:duration-100 group-active:scale-95" />
                <span className={`${utilStyles.link} grow py-1 touch:!decoration-transparent`}>{trick.trick}</span>
              </div>
            ))
          )}
          <Link
            href={TRICK_TYPES_NEW_PAGES[trickType]}
            target="_blank"
            className="group flex cursor-pointer items-center"
          >
            <PlusIcon className="h-6 w-6 shrink-0 transition-transform group-hover:scale-125 group-hover:duration-100 group-active:scale-95" />
            <b className={`${utilStyles.link} grow py-1`}>Add new {TRICK_TYPES_MODELS[trickType]}</b>
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <LoaderButton isLoading={loading} label={`${newCombo ? 'Create' : 'Update'} Combo`} />

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
