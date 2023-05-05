import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';
import { apiCall } from '../../lib/clientUtils';
import utilStyles from '../../styles/utils.module.scss';
import Link from 'next/link';
import GenericTable from '../../components/common/genericTable/genericTable';

export default function ManualsPage() {
  const [manuals, setManuals] = useState([]);
  // const manualColumns = [{ type: { style: { backgroundColor: 'red' } } }];
  const manualColumns = ['type'];
  /* prettier-ignore */ const manualActions = [
    { edit: (obj) => <Link href={`/manuals/${obj._id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>Edit</Link> },
    { view: (obj) => <Link href={`/manuals/${obj._id}`} className={`${utilStyles.button} ${utilStyles.blue}`}>View</Link> },
    { delete: () => <button className={`${utilStyles.button} ${utilStyles.red}`}>Delete</button> } ];
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
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <GenericTable
          objArray={manuals}
          columns={manualColumns}
          actions={manualActions}
          onAction={handleAction}
          entityName="manual"
          newLink="/new-manual"
          showCount
        />
      )}
    </div>
  );
}
