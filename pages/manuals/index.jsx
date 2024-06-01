import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, getCommonActions, hiddenStyle, landedAtCol } from '../../lib/clientUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';
import Filters from '../../components/common/Filters';
import { stringifyValues } from '../../lib/commonUtils';

const defaultFilters = { landed: 'any' };

export default function ManualsPage() {
  const [manuals, setManuals] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  useAsyncEffect(async () => {
    try {
      const searchParams = new URLSearchParams(stringifyValues(filters));
      const { data } = await apiCall('manuals', { method: 'GET', searchParams });
      setManuals(data);
    } catch (error) {
      setManuals([]);
      toast.error(`Failed to not load manuals: ${error.message}`);
    }
  }, [filters]);

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('manuals', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('manuals', { method: 'GET' });
          setManuals(data);
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
        <h1 className="text-center text-5xl">Manuals</h1>
        <p className="mt-3 text-center">This is an overview of all the manuals you've added to your account.</p>
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
            objArray={manuals}
            columns={[{ type: { className: 'text-sm font-bold' } }, landedAtCol]}
            actions={getCommonActions('manuals')}
            onAction={handleAction}
            entityName="manual"
            newLink="/new-manual"
            showCount
            enablePagination
          />
        </TransitionScroll>
      </div>
    </div>
  );
}
