import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, getCommonActions, hiddenStyle } from '../../lib/clientUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';

export default function ManualsPage() {
  const [manuals, setManuals] = useState(null);
  const manualColumns = [{ type: { className: 'text-sm font-bold' } }];
  const manualActions = getCommonActions('manuals');

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('manuals', { method: 'GET' });
      setManuals(data);
    } catch (error) {
      setManuals([]);
      toast.error(`Could not load manuals: ${error.message}`);
    }
  }, []);

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('manuals', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('manuals', { method: 'GET' });
          setManuals(data);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
        break;
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Manuals</h1>
        <p className="mt-3 text-center">This is a overview of all the manuals you've added to your account.</p>
      </div>

      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <GenericTable
          objArray={manuals}
          columns={manualColumns}
          actions={manualActions}
          onAction={handleAction}
          entityName="manual"
          newLink="/new-manual"
          showCount
        />
      </TransitionScroll>
    </div>
  );
}
