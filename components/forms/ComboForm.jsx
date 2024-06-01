import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import formStyles from './form.module.scss';
import { capitalize, fuzzy, getDate, getFullComboName, VN } from '../../lib/commonUtils';
import { ArrowPathIcon, ArrowUturnLeftIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'react-toastify';
import { useAsyncEffect, useCloseOnUrlParam, useTabActive } from '../../lib/customHooks';
import LoaderButton from '../common/LoaderButton';
import {
  apiCall,
  baseStyle,
  directionSelectOptions,
  getEventKeyValue,
  hiddenStyle,
  stanceSelectOptions,
} from '../../lib/clientUtils';
import Link from 'next/link';
import TransitionScroll from 'react-transition-scroll';
import { newComboObj } from '../../pages/new-combo';
import AddAnotherCheckBox from '../common/AddAnotherCheckBox';
import GenerateComboName from './GenerateComboName';
import Show from '../common/Show';

const { TRICK_TYPES_MODELS: TRICK_TYPES_MODELS_CONSTANT } = require('../../models/constants/trickTypes');

const TRICK_TYPES_MAP = {
  flatground: 'Flatground Tricks',
  grind: 'Grinds',
  manual: 'Manuals',
  all: 'All Tricks',
};

const TRICK_TYPES_MODELS = {
  [TRICK_TYPES_MAP.flatground]: TRICK_TYPES_MODELS_CONSTANT.flatground,
  [TRICK_TYPES_MAP.grind]: TRICK_TYPES_MODELS_CONSTANT.grind,
  [TRICK_TYPES_MAP.manual]: TRICK_TYPES_MODELS_CONSTANT.manual,
  [TRICK_TYPES_MAP.combo]: TRICK_TYPES_MODELS_CONSTANT.combo,
};

const TRICK_TYPES = Object.values(TRICK_TYPES_MAP);

const TRICK_TYPES_ENDPOINTS = {
  [TRICK_TYPES_MAP.all]: '',
  [TRICK_TYPES_MAP.flatground]: 'flatgroundtricks',
  [TRICK_TYPES_MAP.grind]: 'grinds',
  [TRICK_TYPES_MAP.manual]: 'manuals',
};

const TRICK_TYPES_NEW_PAGES = {
  [TRICK_TYPES_MAP.flatground]: '/new-flatground-trick?closeAfterAdd=true',
  [TRICK_TYPES_MAP.grind]: '/new-grind?closeAfterAdd=true',
  [TRICK_TYPES_MAP.manual]: '/new-manual?closeAfterAdd=true',
};

const trickTypeHasStance = (trickType) =>
  trickType === TRICK_TYPES_MAP.flatground ||
  trickType === TRICK_TYPES_MAP.grind ||
  trickType === TRICK_TYPES_MAP.manual ||
  trickType === TRICK_TYPES_MAP.all;

const trickTypeHasDirection = (trickType) =>
  trickType === TRICK_TYPES_MAP.grind || trickType === TRICK_TYPES_MAP.flatground || trickType === TRICK_TYPES_MAP.all;

const ComboForm = ({ combo, newCombo = true }) => {
  const router = useRouter();
  const closeAfterAdd = useCloseOnUrlParam('closeAfterAdd');
  const isTabActive = useTabActive({ throttleDelay: 10000 });
  const [trickType, setTrickType] = useState(TRICK_TYPES_MAP.flatground);
  const [tricks, setTricks] = useState(TRICK_TYPES.reduce((acc, trickType) => ({ ...acc, [trickType]: [] }), {})); // Fill tricks with empty arrays for each trick type  const [stance, setStance] = useState('all');
  const [stance, setStance] = useState('all');
  const [direction, setDirection] = useState('all');
  const [loading, setLoading] = useState(true);
  const [tricksRef] = useAutoAnimate();
  const [form, setForm] = useState({
    trickArray: combo.trickArray,
    landed: combo.landed,
    landedAt: getDate(combo.landedAt) || getDate(),
  });
  const [searchString, setSearchString] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [addAnother, setAddAnother] = useState(false);

  const { trickArray, landed, landedAt } = form;

  useAsyncEffect(async () => {
    for (const trickType of TRICK_TYPES) await fetchTrickType(trickType); // Fetch all trick types
  }, []);

  useEffect(() => {
    resetFilters();
  }, [trickType]);

  const fetchTrickType = async (trickType) => {
    if (trickType === TRICK_TYPES_MAP.all) return; // Skip fetching all tricks
    try {
      setLoading(true);
      const { data } = await apiCall(TRICK_TYPES_ENDPOINTS[trickType], { method: 'GET' });

      setTricks((previousTricks) => ({
        ...previousTricks,
        [trickType]: data.map((trick) => ({ ...trick, trickRef: TRICK_TYPES_MODELS[trickType] })),
      }));
    } catch (error) {
      toast.error(`Failed to fetch ${trickType}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useAsyncEffect(async () => {
    await fetchTrickType(trickType);
  }, [isTabActive]);

  const patchData = async (form) => {
    try {
      const { _id } = router.query;
      await apiCall('combos', {
        method: 'PATCH',
        _id,
        data: { ...form, trickArray: trickArray.map(({ _id, trickRef }) => ({ trick: _id, trickRef })) },
      });
      await router.back();
      toast.success(`Successfully updated combo: ${getFullComboName(form)}`);
    } catch (error) {
      toast.error(`Failed to update Combo: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const { data } = await apiCall('combos', {
        method: 'POST',
        data: { ...form, trickArray: trickArray.map(({ _id, trickRef }) => ({ trick: _id, trickRef })) },
      });
      if (addAnother) {
        setForm(newComboObj);
      } else {
        await router.push(`/combos/${data._id}`);
      }
      closeAfterAdd();
      toast.success(`Successfully created combo: ${getFullComboName(form)}`);
    } catch (error) {
      toast.error(`Failed to create combo: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form };
    if (!landed) data.landedAt = null;
    newCombo ? await postData(data) : await patchData(data);
    setLoading(false);
  };

  const resetFilters = () => {
    setStance('all');
    setDirection('all');
    setSearchString('');
  };

  const addTrick = (e, trick) => {
    e.preventDefault();
    if (
      trickArray[trickArray.length - 1]?.trickRef === TRICK_TYPES_MODELS[TRICK_TYPES_MAP.flatground] &&
      trick.trickRef === TRICK_TYPES_MODELS[TRICK_TYPES_MAP.flatground]
    ) {
      return toast.error('Combo cannot have 2 Flatground Tricks in a row');
    }

    if (trickArray.length === 0) {
      setTrickType(TRICK_TYPES_MAP.all); // Switch to all tricks after adding first trick
      resetFilters();
    }

    setForm((prevForm) => ({ ...prevForm, trickArray: [...prevForm.trickArray, trick] }));
  };

  const stanceFilter = (trick) => (stance === 'all' ? true : trick.stance === stance);
  const searchFilter = (trick) => fuzzy(trick.trick, searchString, 0.6);
  const directionFilter = (trick) => (direction === 'all' ? true : trick.direction === direction);
  const allFilters = (arr) => arr.filter(stanceFilter).filter(searchFilter).filter(directionFilter);
  const getTrickArray = () =>
    trickType === TRICK_TYPES_MAP.all
      ? TRICK_TYPES.reduce((acc, trickType) => [...acc, ...allFilters(tricks[trickType])], []) // Get all tricks
      : tricks[trickType]; // Get tricks for current trick type

  const toggleSearch = () => {
    setSearchActive((prev) => !prev);
    setSearchString('');
  };

  const handleChange = (e) => setForm((prevForm) => ({ ...prevForm, ...getEventKeyValue(e) }));

  return (
    <TransitionScroll
      hiddenStyle={hiddenStyle}
      baseStyle={baseStyle}
      className="flex grow flex-col justify-center md:min-w-[400px]"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">{newCombo ? 'New Combo' : 'Edit Combo'}</h1>
        {trickArray.length > 0 && (
          <ArrowUturnLeftIcon
            title="Remove last trick"
            className="size-6 cursor-pointer transition-transform hover:scale-110 active:scale-95 active:duration-75"
            onClick={() => setForm((prevForm) => ({ ...prevForm, trickArray: trickArray.slice(0, -1) }))}
          />
        )}
      </div>

      {/*Trick name*/}
      <GenerateComboName trickArray={trickArray} />
      <hr className="my-2 border-neutral-800 dark:border-neutral-400" />

      <form onSubmit={handleSubmit} className={`${formStyles.form} flex grow flex-col`}>
        <label>
          <search>
            <div className="mb-2 flex flex-row justify-between">
              Select type of trick to add:
              <MagnifyingGlassIcon
                title="Search for tricks"
                onClick={toggleSearch}
                className={`scale-hover-xl size-6 cursor-pointer ${searchActive ? 'opacity-25' : ''}`}
              />
            </div>
            {searchActive && (
              <input
                type="search"
                value={searchString}
                onChange={({ target }) => setSearchString(target.value)}
                placeholder="Search tricks..."
                className="my-2"
              />
            )}
          </search>
          <select name={VN({ trickType })} value={trickType} onChange={({ target }) => setTrickType(target.value)}>
            {Object.keys(TRICK_TYPES_ENDPOINTS).map((trickType) => (
              <option key={trickType} value={trickType}>
                {capitalize(trickType)}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-2 flex flex-row gap-2">
          {trickTypeHasStance(trickType) && (
            <select name={VN({ stance })} value={stance} onChange={({ target }) => setStance(target.value)} required>
              {stanceSelectOptions}
            </select>
          )}
          {trickTypeHasDirection(trickType) && (
            <select
              name={VN({ direction })}
              value={direction}
              onChange={({ target }) => setDirection(target.value)}
              required
            >
              {directionSelectOptions}
            </select>
          )}
        </div>

        {/*Show tricks*/}
        <div
          ref={tricksRef}
          className="mt-4 flex max-h-[40vh] flex-col justify-start gap-2 overflow-y-auto overflow-x-hidden"
        >
          {!allFilters(getTrickArray()).length && !loading ? (
            <p>
              No {stance !== 'all' && stance} {trickType}...
            </p>
          ) : (
            allFilters(getTrickArray()).map((trick) => (
              <button
                style={{ boxShadow: 'unset' }}
                key={trick._id}
                onClick={(e) => addTrick(e, trick)}
                className="group flex cursor-pointer items-center text-start"
              >
                <PlusIcon className="size-6 shrink-0 transition-transform group-hover:scale-125 group-hover:duration-100 group-active:scale-95" />
                <span className="underline-hover grow py-1 touch:!decoration-transparent">{trick.trick}</span>
              </button>
            ))
          )}
          {TRICK_TYPES_NEW_PAGES[trickType] && (
            <Link
              href={TRICK_TYPES_NEW_PAGES[trickType]}
              target="_blank"
              className="group flex cursor-pointer items-center"
            >
              <PlusIcon className="size-6 shrink-0 transition-transform group-hover:scale-125 group-hover:duration-100 group-active:scale-95" />
              <b className="underline-hover py-1 group-hover:decoration-inherit group-hover:duration-100">
                Add new {TRICK_TYPES_MODELS[trickType]}
              </b>
              <ArrowTopRightOnSquareIcon className="ml-1 size-4" />
            </Link>
          )}
        </div>
        <div className="flex justify-between">
          <label title="Did you land this trick?">
            <input
              type="checkbox"
              name={VN({ landed })}
              checked={landed}
              onChange={handleChange}
              className="ml-1 size-4 align-middle"
            />
            <span className="ml-2 align-middle">Landed</span>
          </label>
          {newCombo && (
            <AddAnotherCheckBox checked={addAnother} onChange={({ target }) => setAddAnother(target.checked)} />
          )}
        </div>
        <Show if={landed}>
          <label>
            Date Landed
            <input type="date" max={getDate()} name={VN({ landedAt })} value={landedAt} onChange={handleChange} />
          </label>
        </Show>

        <div className="mb-2 mt-4 flex items-center justify-between">
          <LoaderButton isLoading={loading} label={`${newCombo ? 'Create' : 'Update'} Combo`} />
          {TRICK_TYPES_NEW_PAGES[trickType] && (
            <ArrowPathIcon
              className="size-6 cursor-pointer transition-transform hover:scale-110 active:scale-95 active:duration-75"
              title="Load new tricks"
              onClick={async () => await fetchTrickType(trickType)}
            />
          )}
        </div>
      </form>
    </TransitionScroll>
  );
};

export default ComboForm;
