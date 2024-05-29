import { VN } from '../../../lib/commonUtils';
import Show from '../../common/Show';
import Link from 'next/link';
import * as PropTypes from 'prop-types';

export const PreferredStanceSelect = ({ onChange, preferredStance: preferred_stance }) => (
  <label>
    Preferred stance
    <select
      disabled={!!preferred_stance}
      name={VN({ preferred_stance })}
      value={preferred_stance}
      onChange={onChange}
      required
    >
      <option value="regular">Regular</option>
      <option value="goofy">Goofy</option>
    </select>
    <Show if={preferred_stance}>
      <span className="text-xs">
        Automatically filled in from your{' '}
        <Link className="underline" href="/profile">
          profile
        </Link>
        !
      </span>
    </Show>
  </label>
);

PreferredStanceSelect.propTypes = {
  preferredStance: PropTypes.any,
  onChange: PropTypes.func,
};
