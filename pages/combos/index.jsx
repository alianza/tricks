import Table from '../../components/common/table/table';
import { useState } from 'react';
import { useAsyncEffect } from '../../lib/clientUtils';
import { apiCall } from '../../lib/commonUtils';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';

export default function CombosPage() {
  const [combos, setCombos] = useState([]);
  const [comboColumns, comboActions] = [['combo'], ['edit', 'view', 'delete']];
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    try {
      const { data } = await apiCall('combos', { method: 'GET' });
      setCombos(data);
    } catch (error) {
      toast.error(`Could not load combos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <div>
        <h1 className="text-center text-5xl">Combos</h1>
        <p className="mt-3 text-center">This is a overview of all the combos you've added to your account.</p>
      </div>
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <Table
          objArray={combos}
          columns={comboColumns}
          actions={comboActions}
          endpoint="combos"
          newLink="/new-combo"
          showCount
        />
      )}
    </div>
  );
}
