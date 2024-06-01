import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import {
  apiCall,
  baseStyle,
  getCommonActions,
  hiddenStyle,
  landedAtCol,
  stanceSelectOptions,
  triggerLoader,
} from '../../lib/clientUtils';
import { stringifyValues } from '../../lib/commonUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';
import Filters from '../../components/common/Filters';
import { useRouter } from 'next/router';

const defaultFilters = { grind: false, manual: false, stance: 'all', landed: 'any' };

export default function CombosPage() {
  const [combos, setCombos] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const router = useRouter();

  useAsyncEffect(async () => {
    try {
      triggerLoader(router);
      const params = new URLSearchParams(stringifyValues(filters));
      const { data } = await apiCall(`combos?${params}`, { method: 'GET' });
      setCombos(data);
    } catch (error) {
      setCombos([]);
      toast.error(`Failed to load combos: ${error.message}`);
    }
  }, [filters]);

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('combos', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('combos', { method: 'GET' });
          setCombos(data);
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
        <h1 className="text-center text-5xl">Combos</h1>
        <p className="mt-3 text-center">This is an overview of all the combos you've added to your account.</p>
      </div>
      <div className="flex flex-col gap-4">
        <Filters filters={filters} onReset={() => setFilters(defaultFilters)}>
          <label className="flex gap-1">
            <input
              type="checkbox"
              checked={filters.grind}
              onChange={({ target }) => setFilters({ ...filters, grind: target.checked })}
            />
            <div className="ml-2 text-sm">
              <p className="font-medium">Grind Combos</p>
              <p className="text-xs font-normal text-neutral-600 dark:text-neutral-300">
                For combos that include grinds.
              </p>
            </div>
          </label>
          <label className="flex gap-1">
            <input
              type="checkbox"
              checked={filters.manual}
              onChange={({ target }) => setFilters({ ...filters, manual: target.checked })}
            />
            <div className="ml-2 text-sm">
              <p className="font-medium">Manual Combos</p>
              <p className="text-xs font-normal text-neutral-600 dark:text-neutral-300">
                For combos that include manuals.
              </p>
            </div>
          </label>
          <select
            className="rounded bg-neutral-200 p-2 text-neutral-900 dark:bg-neutral-600 dark:text-neutral-50"
            value={filters.stance}
            onChange={({ target }) => setFilters({ ...filters, stance: target.value })}
            required
          >
            {stanceSelectOptions}
          </select>
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
            objArray={combos}
            columns={[{ trick: { className: 'text-sm font-bold', alias: 'Combo name' } }, landedAtCol]}
            actions={getCommonActions('combos')}
            onAction={handleAction}
            entityName="combo"
            newLink="/new-combo"
            showCount
            enablePagination
          />
        </TransitionScroll>
      </div>
    </div>
  );
}
