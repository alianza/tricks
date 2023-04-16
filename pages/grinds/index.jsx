import Table from '../../components/common/table/table';
import { useState } from 'react';
import { useAsyncEffect } from '../../lib/clientUtils';
import { apiCall } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';

export default function GrindsPage() {
  const [grinds, setGrinds] = useState([]);
  const grindColumns = ['stance', 'direction', 'name', 'trick'];
  const grindActions = ['edit', 'view', 'delete'];
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('grinds', { method: 'GET' });
      setGrinds(data);
    } catch (error) {
      toast.error(`Could not load grinds: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Grinds</h1>
        <p className="mt-3 text-center">This is a overview of all the grinds you've added to your account.</p>
      </div>
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <Table
          objArray={grinds}
          columns={grindColumns}
          actions={grindActions}
          endpoint="grinds"
          newLink="/new-grind"
          showCount
        />
      )}
    </div>
  );
}
