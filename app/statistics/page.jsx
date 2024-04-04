import Stats from '@/appComponents/stats/Stats';
import { statsDef } from '../page';

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

export default function Statistics({}) {
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
    </div>
  );
}
