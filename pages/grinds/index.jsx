import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, getCommonActions, hiddenStyle, trickCol } from '../../lib/clientUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';

export default function GrindsPage() {
  const [grinds, setGrinds] = useState(null);
  const grindColumns = ['stance', 'direction', 'name', trickCol];
  const grindActions = getCommonActions('grinds');

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('grinds', { method: 'GET' });
      setGrinds(data);
    } catch (error) {
      setGrinds([]);
      toast.error(`Could not load grinds: ${error.message}`);
    }
  }, []);

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('grinds', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('grinds', { method: 'GET' });
          setGrinds(data);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
        break;
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Grinds</h1>
        <p className="mt-3 text-center">This is a overview of all the grinds you've added to your account.</p>
      </div>

      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <GenericTable
          objArray={grinds}
          columns={grindColumns}
          actions={grindActions}
          entityName="grind"
          onAction={handleAction}
          newLink="/new-grind"
          showCount
        />
      </TransitionScroll>
    </div>
  );
}
