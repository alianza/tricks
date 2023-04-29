import Table from '../../components/common/table/table';
import { useState } from 'react';
import { useAsyncEffect } from '../../lib/clientUtils';
import { apiCall } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';

export default function ManualsPage() {
  const [manuals, setManuals] = useState([]);
  const [manualActions, manualColumns] = [['edit', 'view', 'delete'], ['type']];
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('manuals', { method: 'GET' });
      setManuals(data);
    } catch (error) {
      toast.error(`Could not load manuals: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAction = async (action, obj) => {
    console.log(`ACTION PARENT`, action);
    console.log(`OBJ PARENT`, obj);
    switch (action) {
      case 'edit':
        console.log(`EDIT`);
        break;
      case 'view':
        console.log(`VIEW`);
        break;
      case 'delete':
        console.log(`DELETE`);
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('manuals', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('manuals', { method: 'GET' });
          setManuals(data);
        } catch (error) {
          toast.error(`Failed to delete ${obj.trick}: ${error.message}`);
        }
        console.log(`manuals`, manuals);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Manuals</h1>
        <p className="mt-3 text-center">This is a overview of all the manuals you've added to your account.</p>
      </div>
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <Table
          objArray={manuals}
          columns={manualColumns}
          actions={manualActions}
          onAction={(action, obj) => handleAction(action, obj)}
          endpoint="manuals"
          newLink="/new-manual"
          showCount
        />
      )}
    </div>
  );
}
