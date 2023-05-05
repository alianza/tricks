import Table from '../../components/common/table/table';
import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';
import { apiCall } from '../../lib/clientUtils';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

const defaultFilters = { grind: false, manual: false, stance: 'all' };

export default function CombosPage() {
  const [combos, setCombos] = useState([]);
  const [comboColumns, comboActions] = [['combo'], ['edit', 'view', 'delete']];
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('combos/search', { method: 'POST', body: JSON.stringify(filters) });
      setCombos(data);
    } catch (error) {
      toast.error(`Could not load combos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Combos</h1>
        <p className="mt-3 text-center">This is a overview of all the combos you've added to your account.</p>
      </div>
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <div className="flex flex-col gap-4">
          <details className="rounded-lg bg-neutral-50 p-4 shadow-lg dark:bg-neutral-800">
            <summary className="cursor-pointer text-xl font-medium">Filters</summary>
            <hr className="my-4 border-neutral-800 dark:border-neutral-400" />
            <div className="flex flex-wrap items-center gap-4">
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
                <option value="all">All Stances</option>
                <option value="regular">Regular</option>
                <option value="fakie">Fakie</option>
                <option value="switch">Switch</option>
                <option value="nollie">Nollie</option>
              </select>
              <button
                title="Reset filters"
                className="ml-auto p-2 transition-transform hover:scale-110 hover:duration-100 active:scale-95"
                onClick={() => setFilters(defaultFilters)}
              >
                <ArrowPathIcon className="h-6 w-6"></ArrowPathIcon>
              </button>
            </div>
          </details>
          <Table
            objArray={combos}
            columns={comboColumns}
            actions={comboActions}
            endpoint="combos"
            newLink="/new-combo"
            showCount
          />
        </div>
      )}
    </div>
  );
}
