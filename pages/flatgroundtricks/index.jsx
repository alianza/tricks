import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import { apiCall, baseStyle, getCommonActions, hiddenStyle, trickCol } from '../../lib/clientUtils';
import GenericTable from '../../components/common/genericTable/GenericTable';
import TransitionScroll from 'react-transition-scroll';

export default function FlatgroundTricksPage() {
  const [flatgroundTricks, setFlatgroundTricks] = useState(null);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', trickCol];
  const flatgroundActions = getCommonActions('flatgroundtricks');

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('flatgroundtricks', { method: 'GET' });
      setFlatgroundTricks(data);
    } catch (error) {
      setFlatgroundTricks([]);
      toast.error(`Could not load flatground tricks: ${error.message}`);
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
          This is a overview of all the flatground tricks you've added to your account.
        </p>
      </div>

      <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle} className="flex flex-col">
        <GenericTable
          objArray={flatgroundTricks}
          columns={flatgroundColumns}
          actions={flatgroundActions}
          onAction={handleAction}
          entityName="flatground trick"
          newLink="/new-flatground-trick"
          showCount
        />
      </TransitionScroll>
    </div>
  );
}
