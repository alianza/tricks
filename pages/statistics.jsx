import Stats from '../components/stats/Stats';
import { statsDef } from './index';

const stanceStatsDef = {
  Regular: { endpoint: '/mine/regular', value: '...' },
  Fakie: { endpoint: '/mine/fakie', value: '...' },
  Nollie: { endpoint: '/mine/nollie', value: '...' },
  Switch: { endpoint: '/mine/switch', value: '...' },
};

// const otherStatsDef = {
//   average combo length

// }

export default function Statistics({}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="mb-4 text-4xl font-bold">Detailed Stats</h1>
      <Stats
        statsDefinition={statsDef}
        title="Trick Types"
        description="Here are some basic statistics about your progress."
      />
      <Stats
        statsDefinition={stanceStatsDef}
        title="Stances"
        description="Here are some basic statistics about your progress."
      />
    </div>
  );
}
