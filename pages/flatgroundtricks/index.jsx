import Table from '../../components/common/table/table';
import { useState } from 'react';
import { useAsyncEffect } from '../../lib/clientUtils';
import { apiCall } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';

export default function FlatgroundTricksPage() {
  const [flatgroundTricks, setFlatgroundTricks] = useState([]);
  const flatgroundColumns = ['stance', 'direction', 'rotation', 'name', 'trick'];
  const flatgroundActions = ['edit', 'view', 'delete'];
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('flatgroundtricks', { method: 'GET' });
      setFlatgroundTricks(data);
    } catch (error) {
      toast.error(`Could not load flatground tricks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Flatground Tricks</h1>
        <p className="mt-3 text-center">
          This is a overview of all the flatground tricks you've added to your account.
        </p>
      </div>
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <Table
          objArray={flatgroundTricks}
          columns={flatgroundColumns}
          actions={flatgroundActions}
          endpoint="flatgroundtricks"
          newLink="/new-flatground-trick"
          showCount
        />
      )}
    </div>
  );
}
