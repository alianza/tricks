import Table from '../../components/common/table/table';
import { useState } from 'react';
import { useAsyncEffect } from '../../lib/customHooks';
import { toast } from 'react-toastify';
import Loader from '../../components/common/loader/loader';
import { apiCall } from '../../lib/clientUtils';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.scss';
import GenericTable from '../../components/common/genericTable/genericTable';

export default function FlatgroundTricksPage() {
  const [flatgroundTricks, setFlatgroundTricks] = useState([]);
  const flatgroundColumns = [
    'stance',
    'direction',
    'rotation',
    { name: {} },
    { trick: { alias: 'trickName', className: 'text-sm font-bold' } },
  ];
  /* prettier-ignore */ const flatgroundActions = [
    { edit: (obj) => <Link href={`/flatgroundtricks/${obj._id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>Edit</Link> },
    { view: (obj) => <Link href={`/flatgroundtricks/${obj._id}`} className={`${utilStyles.button} ${utilStyles.blue}`}>View</Link> },
    { delete: () => <button className={`${utilStyles.button} ${utilStyles.red}`}>Delete</button> } ];
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

  const handleAction = async (action, obj) => {
    switch (action) {
      case 'delete':
        try {
          if (!confirm(`Are you sure you want to delete "${obj.trick}"?`)) return;
          await apiCall('flatgroundtricks', { method: 'DELETE', id: obj._id });
          const { data } = await apiCall('flatgroundtricks', { method: 'GET' });
          setFlatgroundTricks(data);
        } catch (error) {
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
      {loading ? (
        <Loader className="mx-auto my-24" />
      ) : (
        <GenericTable
          objArray={flatgroundTricks}
          columns={flatgroundColumns}
          actions={flatgroundActions}
          onAction={handleAction}
          entityName="flatground trick"
          newLink="/new-flatground-trick"
          showCount
        />
      )}
    </div>
  );
}
