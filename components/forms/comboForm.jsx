import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import styles from './form.module.scss';
import { capitalize, getFullGrindName, VN } from '../../lib/util';
import utilStyles from '../../styles/utils.module.scss';

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };

const TRICK_TYPES = ['Flatground Tricks', 'Grinds'];

const TRICK_TYPES_ENDPOINTS = {
  'Flatground Tricks': 'flatgroundtricks',
  Grinds: 'grinds',
};

const TRICK_TYPES_COLLECTIONS = {
  'Flatground Tricks': 'FlatgroundTrick',
  Grinds: 'Grind',
};

const ComboForm = ({ comboForm, newCombo = true }) => {
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [fullComboName, setFullComboName] = useState(null);
  const [tricks, setTricks] = useState([]);

  const [trickType, setTrickType] = useState(TRICK_TYPES[0]);

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
        body: JSON.stringify(form),
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
    console.log(`JSON.stringify(form)`, JSON.stringify(form));
    try {
      const res = await fetch('/api/combos', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });

      console.log(`res`, res);

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      await router.push('/');
    } catch (error) {
      setMessage(`Failed to add Combo: ${error.message}`);
    }
  };

  const handleChange = ({ target }) => {
    let { value, name } = target;

    if (target.type === 'checkbox') {
      value = target.checked;
    }

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
      trickArray: [...trickArray, { _id: trick._id, trickRef: TRICK_TYPES_COLLECTIONS[trickType] }],
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className="text-2xl">{newCombo ? 'New Combo' : 'Edit Combo'}</h1>

      {trickArray.map((trick) => (
        <p>{trick._id}</p>
      ))}

      {!trickArray.length && <h4>Select type of trick to add</h4>}

      <label>
        Trick Type
        <select name={VN({ trickType })} value={trickType} onChange={({ target }) => setTrickType(target.value)}>
          {TRICK_TYPES.map((trickType) => (
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
          className={`${utilStyles.button} bg-blue-500 focus:ring-blue-600/50 hover:bg-blue-600`}
        >
          {trick.trick}
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
