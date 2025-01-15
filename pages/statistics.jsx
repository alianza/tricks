import Stats from '../components/stats/Stats';
import { statsDef } from './index';
import dbConnect from '../lib/dbConnect';
import FlatgroundTrick from '../models/FlatgroundTrick';
import { Line } from 'react-chartjs-2';
import { requireAuth } from '../lib/serverUtils';
import { capitalize } from '../lib/commonUtils';
import { baseStyle, hiddenStyle } from '../lib/clientUtils';
import TransitionScroll from '../components/common/transitionScroll/TransitionScroll';
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const userStatsDef = {
  'Account Age': { endpoint: '/mine/profile/account-age', value: '...', suffix: 'Days' },
  'Register date': { endpoint: '/mine/profile/register-date', value: '...' },
};

const stanceStatsDef = {
  Regular: { endpoint: '/mine/stance/regular', value: '...' },
  Fakie: { endpoint: '/mine/stance/fakie', value: '...' },
  Nollie: { endpoint: '/mine/stance/nollie', value: '...' },
  Switch: { endpoint: '/mine/stance/switch', value: '...' },
};

const comboStatsDef = {
  'Average Combo Length': { endpoint: '/mine/combos/average-combo-length', value: '...', suffix: 'Tricks' },
  'Grind Combos': { endpoint: '/mine/combos/grind-combos', value: '...' },
  'Manual Combos': { endpoint: '/mine/combos/manual-combos', value: '...' },
};

export async function getServerSideProps({ params, req, res }) {
  await dbConnect();

  const { authQuery } = await requireAuth(req, res);

  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return capitalize(date.toLocaleString('default', { month: 'short' }));
  }).reverse();

  const tricks = await FlatgroundTrick.find({ ...authQuery, landed: true }).lean();
  const data = {
    labels,
    datasets: [
      {
        id: 1,
        label: 'Landed Flatground Tricks',
        tension: 0.3,
        borderColor: '#fff',
        data: labels.map(
          (month) =>
            tricks.filter(
              (trick) => capitalize(new Date(trick.landedAt).toLocaleString('default', { month: 'short' })) === month,
            ).length,
        ),
      },
    ],
  };

  return {
    props: {
      data,
    },
  };
}

export default function Statistics(props) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="mb-4 text-4xl font-bold">Detailed Stats</h1>
      <Stats
        statsDefinition={userStatsDef}
        title="Account"
        description="Here are some basic statistics about your account."
      />
      <Stats
        statsDefinition={statsDef}
        title="Trick Types"
        description="Here are some basic statistics about your progress."
      />
      <Stats
        statsDefinition={stanceStatsDef}
        title="Stances"
        description="Here are some statistics about your tricks by stance."
        showTrickTypes
      />
      <Stats
        statsDefinition={comboStatsDef}
        title="Combo's"
        description="Here are some statistics about your combo's."
      />
      <TransitionScroll
        hiddenStyle={hiddenStyle}
        baseStyle={baseStyle}
        as="section"
        className="flex flex-col gap-4 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800"
      >
        <div>
          <h1 className="mb-1 text-4xl font-bold">{'Landed over time'}</h1>
          <p>Here is a graph showing the number of tricks you have landed each month over the last year.</p>
        </div>
        <div className="rounded-lg bg-neutral-200 px-4 py-6 shadow-sm sm:grid-cols-2 dark:bg-neutral-700">
          <Line datasetIdKey="id" data={props.data} />
        </div>
      </TransitionScroll>
    </div>
  );
}
