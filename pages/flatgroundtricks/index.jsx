import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import {
  apiCall,
  baseStyle,
  getCommonActions,
  hiddenStyle,
  landedAtCol,
  trickCol,
  triggerLoader,
} from '../../lib/clientUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';
import Filters from '../../components/common/Filters';
import { stringifyValues } from '../../lib/commonUtils';
import { useRouter } from 'next/router';

const defaultFilters = { landed: 'any' };

export default function FlatgroundTricksPage() {
  const [flatgroundTricks, setFlatgroundTricks] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const router = useRouter();

  useAsyncEffect(async () => {
    try {
      triggerLoader(router);
      const searchParams = new URLSearchParams(stringifyValues(filters));
      const { data } = await apiCall(`flatgroundtricks`, { method: 'GET', searchParams });
      setFlatgroundTricks(data);
    } catch (error) {
      setFlatgroundTricks([]);
      toast.error(`Failed to load Flatground Tricks: ${error.message}`);
    }
  }, [filters]);

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('flatgroundtricks', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('flatgroundtricks', { method: 'GET' });
          setFlatgroundTricks(data);
          toast.success(`Successfully deleted ${obj.trick}`);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
        break;
    }
  };

  return (
    <div className="flex flex-col gap-12">
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
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        </Filters>

        <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
          <GenericTable
            objArray={flatgroundTricks}
            columns={['stance', 'direction', 'rotation', 'name', trickCol, landedAtCol]}
            actions={getCommonActions('flatgroundtricks')}
            onAction={handleAction}
            entityName="flatground trick"
            newLink="/new-flatground-trick"
            showCount
            defaultSortColumnIndex={5}
            defaultSortDirection="desc"
            enablePagination
          />
        </TransitionScroll>
      </div>
    </div>
  );
}
