import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, getCommonActions, hiddenStyle, landedAtCol, trickCol } from '../../lib/clientUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';
import Filters from '../../components/common/Filters';

const defaultFilters = { landed: 'any' };

export default function FlatgroundTricksPage() {
  const [flatgroundTricks, setFlatgroundTricks] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('flatgroundtricks', { method: 'GET' });
      setFlatgroundTricks(data);
    } catch (error) {
      setFlatgroundTricks([]);
      toast.error(`Could not load Flatground Tricks: ${error.message}`);
    }
  }, []);

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('flatgroundtricks', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('flatgroundtricks', { method: 'GET' });
          setFlatgroundTricks(data);
        } catch (error) {
          setFlatgroundTricks([]);
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
        break;
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Flatground Tricks</h1>
        <p className="mt-3 text-center">
          This is an overview of all the Flatground Tricks you've added to your account.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Filters filters={filters} onReset={() => setFilters(defaultFilters)}>
          <label className="flex items-center gap-1">
            Landed:
            <select
              className="rounded bg-neutral-200 p-2 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-50"
              value={filters.landed}
              onChange={({ target }) => setFilters({ ...filters, landed: target.value })}
              required
            >
              <option defaultValue value="any">
                Any
              </option>
              <hr />
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </Filters>

        <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
          <GenericTable
            objArray={
              filters.landed === 'any'
                ? flatgroundTricks
                : flatgroundTricks?.filter((trick) => filters.landed === (trick.landed ? 'yes' : 'no'))
            }
            columns={['stance', 'direction', 'rotation', 'name', trickCol, landedAtCol]}
            actions={getCommonActions('flatgroundtricks')}
            onAction={handleAction}
            entityName="flatground trick"
            newLink="/new-flatground-trick"
            showCount
            defaultSortColumnIndex={4}
          />
        </TransitionScroll>
      </div>
    </div>
  );
}
