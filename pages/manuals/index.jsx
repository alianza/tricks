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
          endpoint="manuals"
          newLink="/new-manual"
          showCount
        />
      )}
    </div>
  );
}
