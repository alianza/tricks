import Link from 'next/link';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.scss';
import { capitalize, getFullManualName } from '../../lib/commonUtils';
import PropTypes from 'prop-types';
import { apiCall, baseStyle, hiddenStyle } from '../../lib/clientUtils';
import { toast } from 'react-toastify';
import TransitionScroll from '../common/transitionScroll/TransitionScroll';
import RenderSafeDate from '../common/RenderSafeDate';

export default function ManualDetails({ manual }) {
  const router = useRouter();

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
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <h1 className="mb-1 text-5xl font-bold">{manual.trick}</h1>
      <h3 className="text-xl">
        <b>Preferred stance:</b> {capitalize(manual.preferred_stance)}
      </h3>
      <div className="mt-4">
        <p>
          <b className="mr-1">Type:</b>
          {capitalize(manual.type)}
        </p>
      </div>
      {manual.landed && manual.landedAt && (
        <div className="mt-4">
          <p>
            <b className="mr-1">Landed: ✅</b>
            <RenderSafeDate date={manual.landedAt} />
          </p>
        </div>
      )}
      <div className="mt-2">
        <p>
          <b className="mr-1">Created at:</b>
          <RenderSafeDate date={manual.createdAt} options={{ includeTime: true }} />
        </p>
        <p>
          <b className="mr-1">Updated at:</b>
          <RenderSafeDate date={manual.updatedAt} options={{ includeTime: true }} />
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
    </TransitionScroll>
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
    landed: PropTypes.bool.isRequired,
    landedAt: PropTypes.string,
  }).isRequired,
};
