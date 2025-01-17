import Link from 'next/link';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.scss';
import { capitalize, getFullGrindName } from '../../lib/commonUtils';
import PropTypes from 'prop-types';
import { apiCall, baseStyle, hiddenStyle } from '../../lib/clientUtils';
import { toast } from 'react-toastify';
import TransitionScroll from '../common/transitionScroll/TransitionScroll';
import RenderSafeDate from '../common/RenderSafeDate';

export default function GrindDetails({ grind }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (!confirm(`Are you sure you want to delete "${getFullGrindName(grind)}"?`)) return;
      await apiCall('grinds', { method: 'DELETE', id: router.query._id });
      await router.push('/dashboard');
    } catch (error) {
      toast.error(`Failed to delete the grind: ${error.message}`);
    }
  };

  return (
    <TransitionScroll hiddenStyle={hiddenStyle} baseStyle={baseStyle}>
      <h1 className="mb-1 text-5xl font-bold">{grind.trick}</h1>
      <h3 className="text-xl">
        <b>Preferred stance:</b> {capitalize(grind.preferred_stance)}
      </h3>
      <div className="mt-4">
        <p>
          <b className="mr-1">Stance:</b>
          {capitalize(grind.stance)}
        </p>
        {grind.direction !== 'none' && (
          <p>
            <b className="mr-1">Direction:</b>
            {capitalize(grind.direction)}
          </p>
        )}
        <p>
          <b className="mr-1">Trick:</b>
          {grind.name}
        </p>
      </div>
      {grind.landed && grind.landedAt && (
        <div className="mt-4">
          <p>
            <b className="mr-1">Landed: ✅</b>
            <RenderSafeDate date={grind.landedAt} />
          </p>
        </div>
      )}
      <div className="mt-2">
        <p>
          <b className="mr-1">Created at:</b>
          <RenderSafeDate date={grind.createdAt} options={{ includeTime: true }} />
        </p>
        <p>
          <b className="mr-1">Updated at:</b>
          <RenderSafeDate date={grind.updatedAt} options={{ includeTime: true }} />
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/grinds/${grind._id}/edit`} className={`${utilStyles.button} ${utilStyles.green}`}>
          Edit
        </Link>
        <button onClick={handleDelete} className={`${utilStyles.button} ${utilStyles.red}`}>
          Delete
        </button>
      </div>
    </TransitionScroll>
  );
}

GrindDetails.propTypes = {
  grind: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    preferred_stance: PropTypes.string.isRequired,
    stance: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    trick: PropTypes.string.isRequired,
    landed: PropTypes.bool.isRequired,
    landedAt: PropTypes.string,
  }).isRequired,
};
