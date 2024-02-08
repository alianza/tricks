import Link from 'next/link';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.scss';
import { getFullManualName } from '../../lib/commonUtils';
import PropTypes from 'prop-types';
import { apiCall, formatDate } from '../../lib/clientUtils';
import { toast } from 'react-toastify';

export default function ManualDetails({ manual }) {
  const router = useRouter();

  console.log(`manual ManualDetails`, manual);

  const handleDelete = async () => {
    try {
      if (!confirm(`Are you sure you want to delete "${getFullManualName(manual)}"?`)) return;
      await apiCall('manuals', { method: 'DELETE', id: router.query._id });
      await router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to delete the manual: ${error.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl mb-1">{manual.trick}</h1>
      <h3 className="text-xl">
        <b>Preferred stance:</b> {manual.preferred_stance}
      </h3>
      <div className="mt-4">
        <p>
          <b className="mr-1">Type:</b>
          {manual.type}
        </p>
      </div>
      <div className="mt-2">
        <p>
          <b className="mr-1">Created at:</b>
          {formatDate(manual.createdAt, { includeTime: true })}
        </p>
        <p>
          <b className="mr-1">Updated at:</b>
          {formatDate(manual.updatedAt, { includeTime: true })}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/manuals/${manual._id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>
          Edit
        </Link>
        <button onClick={handleDelete} className={`${utilStyles.button} ${utilStyles.red}`}>
          Delete
        </button>
      </div>
    </div>
  );
}

ManualDetails.propTypes = {
  manual: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    preferred_stance: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    trick: PropTypes.string.isRequired,
  }).isRequired,
};
