import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, hiddenStyle } from '../../lib/clientUtils';
import TransitionScroll from 'react-transition-scroll';
import { capitalize, VN } from '../../lib/commonUtils';
import { TRICK_TYPES_ENUM } from '../../models/constants/trickTypes';

const defaultTrickType = 'all';

const getDefaultStats = (statsDefinition) =>
  Object.entries(statsDefinition).map(([label, { value }]) => [label, value]);

export default function Stats({ statsDefinition, title, description, showTrickTypes = false }) {
  const [stats, setStats] = useState(getDefaultStats(statsDefinition));
  const [trickType, setTrickType] = useState(defaultTrickType);

  useAsyncEffect(async () => {
    setStats(getDefaultStats(statsDefinition));

    const fetchAndSetData = async (statsDef, setData) => {
      const [label, stat] = statsDef;
      try {
        const { data } = await apiCall(`stats/${stat.endpoint}`, { method: 'POST', data: { trickType } });
        setData((prev) => prev.map(([key, value]) => (key === label ? [key, data.count] : [key, value])));
      } catch (error) {
        toast.error(`Failed to fetch ${stat.endpoint}: ${error.message}`);
      }
    };

    Object.entries(statsDefinition).forEach((statsDef) => fetchAndSetData(statsDef, setStats));
  }, [trickType]);

  return (
    <TransitionScroll
      hiddenStyle={hiddenStyle}
      baseStyle={baseStyle}
      as="section"
      className="mb-8 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800"
    >
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p className="my-4">{description}</p>
      {showTrickTypes && (
        <select
          className="bg-neutral-50 dark:bg-neutral-900 rounded w-full my-4 block p-2 text-lg font-medium"
          name={VN({ trickType })}
          value={trickType}
          onChange={({ target }) => setTrickType(target.value)}
        >
          {[defaultTrickType, ...TRICK_TYPES_ENUM].map((trickType) => (
            <option key={trickType} value={trickType}>
              {`${capitalize(trickType)} tricks`}
            </option>
          ))}
        </select>
      )}
      <div className="grid grid-cols-1 gap-8 rounded-lg bg-neutral-200 px-4 py-6 dark:bg-neutral-700 sm:grid-cols-2">
        {stats.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2 sm:last:odd:col-span-2">
            <h2 className="text-center text-2xl font-bold">{key}</h2>
            <p className="text-center text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </TransitionScroll>
  );
}
