import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { capitalize, getFullGrindName, VN } from '../../lib/util';
import utilStyles from '../../styles/utils.module.scss';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/20/solid';

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

const TRICK_TYPES_ENDPOINTS = {
  'Flatground Tricks': 'flatgroundtricks',
  Grinds: 'grinds',
};

const TRICK_TYPES_MODEL_NAMES = {
  'Flatground Tricks': 'FlatgroundTrick',
  Grinds: 'Grind',
};

const ComboForm = ({ comboForm, newCombo = true }) => {
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [fullComboName, setFullComboName] = useState(null);
  const [tricks, setTricks] = useState([]);

  const [trickType, setTrickType] = useState(Object.keys(TRICK_TYPES_ENDPOINTS)[0]);

  const [form, setForm] = useState({
    trickArray: comboForm.trickArray,
  });

  const { trickArray } = form;

  useEffect(() => {
    setFullComboName(getFullGrindName(form));
  }, [form]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/${TRICK_TYPES_ENDPOINTS[trickType]}`, {
        method: 'GET',
        headers,
      });
      const { data } = await res.json();
      setTricks(data);
    })();
  }, [trickType]);

  const patchData = async (form) => {
    const { _id } = router.query;

    try {
      const res = await fetch(`/api/combos/${_id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(trimTrickArray(form)),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      const { data } = await res.json();

      await mutate(`/api/combos/${_id}`, data, false); // Update the local data without a revalidation
      await router.push('/');
    } catch (error) {
      setMessage(`Failed to update grind: ${error.message}`);
    }
  };

  const postData = async (form) => {
    try {
      const res = await fetch('/api/combos', {
        method: 'POST',
        headers,
        body: JSON.stringify(trimTrickArray(form)),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      await router.push('/');
    } catch (error) {
      setMessage(`Failed to add Combo: ${error.message}`);
    }
  };

  const trimTrickArray = (form) => ({
    ...form,
    trickArray: form.trickArray.map((trick) => ({
      trick: trick._id,
      trickRef: trick.trickRef,
    })),
  });

  const handleChange = ({ target }) => {
    let { value, name } = target;
    if (target.type === 'checkbox') value = target.checked;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    newCombo ? postData(form) : patchData(form);
  };

  function addTrick(e, trick) {
    e.preventDefault();
    setForm({
      ...form,
      trickArray: [...trickArray, { ...trick, trickRef: TRICK_TYPES_MODEL_NAMES[trickType] }],
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className="text-2xl">{newCombo ? 'New Combo' : 'Edit Combo'}</h1>

      <div className="mt-4 flex gap-2">
        {trickArray.map((trick, index) => (
          <div key={trick._id + index} className="flex gap-2">
            <span className="font-bold">{trick.trick}</span>
            {(index < trickArray.length - 1 || trickArray.length === 1) && (
              <span>
                <ArrowRightIcon title="To" className="h-6 w-6" />
              </span>
            )}
            {trickArray.length > 2 && index === trickArray.length - 1 && <span className="font-bold"> Out </span>}
            {trickArray.length === 1 && <span className="font-bold"> ... </span>}
          </div>
        ))}
      </div>

      {!trickArray.length && <h4>Select type of trick to add</h4>}

      <label>
        Trick type to add
        <select name={VN({ trickType })} value={trickType} onChange={({ target }) => setTrickType(target.value)}>
          {Object.keys(TRICK_TYPES_ENDPOINTS).map((trickType) => (
            <option key={trickType} value={trickType}>
              {capitalize(trickType)}
            </option>
          ))}
        </select>
      </label>

      {tricks.map((trick) => (
        <button
          key={trick._id}
          onClick={(e) => addTrick(e, trick)}
          className={`${utilStyles.button} mt-4 flex items-center bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600`}
        >
          <PlusIcon className="-ml-2 h-6 w-6" />
          <span>{trick.trick}</span>
        </button>
      ))}

      {/*<p className="my-4">*/}
      {/*  Full combo name: <b>{fullComboName}</b>*/}
      {/*</p>*/}

      <p className="my-4">{message}</p>

      <button type="submit" className={`${utilStyles.button} bg-green-500 focus:ring-green-600/50 hover:bg-green-600`}>
        Submit
      </button>
    </form>
  );
};

export default ComboForm;
