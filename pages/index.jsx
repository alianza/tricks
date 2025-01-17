import { signIn, useSession } from 'next-auth/react';
import utilStyles from '../styles/utils.module.scss';
import Link from 'next/link';
import Stats from '../components/stats/Stats';
import { baseStyle, hiddenStyle } from '../lib/clientUtils';
import TransitionScroll from '../components/common/transitionScroll/TransitionScroll';

export const statsDef = {
  'Flatground Tricks': { endpoint: '/mine/flatgroundtricks', value: '...' },
  Grinds: { endpoint: '/mine/grinds', value: '...' },
  Manuals: { endpoint: '/mine/manuals', value: '...' },
  Combos: { endpoint: '/mine/combos', value: '...' },
};

const globalStatsDef = {
  'Flatground Tricks': { endpoint: '/flatgroundtricks', value: '...' },
  Grinds: { endpoint: '/grinds', value: '...' },
  Manuals: { endpoint: '/manuals', value: '...' },
  Combos: { endpoint: '/combos', value: '...' },
  Users: { endpoint: '/users', value: '...' },
};

export default function Index() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-8">
      <TransitionScroll
        hiddenStyle={hiddenStyle}
        baseStyle={baseStyle}
        as="section"
        className="rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800"
      >
        <h1 className="mb-4 text-4xl font-bold">Track Your Skateboarding Tricks Progress</h1>
        <p className="mb-4">
          Keep track of the tricks you've learned and the ones you want to master. Set goals and track your progress
          over time.
        </p>
        {!session ? (
          <button
            onClick={() => signIn()}
            className={`${utilStyles.button} w-full bg-gray-700 text-lg text-neutral-50 outline-gray-500 hover:bg-gray-800 focus:ring-gray-600/50 dark:bg-gray-300 dark:text-neutral-900 hover:dark:bg-gray-400`}
          >
            Sign in to get started!
          </button>
        ) : (
          <Link
            href="/dashboard"
            className={`${utilStyles.button} block w-full bg-blue-700 text-center text-lg text-neutral-50 outline-blue-500 hover:bg-blue-800 focus:ring-blue-600/50`}
          >
            Go to your dashboard!
          </Link>
        )}
      </TransitionScroll>

      {session && (
        <Stats
          statsDefinition={statsDef}
          title="Your statistics"
          description="Here are some basic statistics about your progress."
        >
          <div className="flex flex-col gap-4 rounded-lg bg-neutral-200 px-4 py-6 shadow-sm dark:bg-neutral-700">
            <div>
              <h1 className="mb-1 text-4xl font-bold">Detailed Statistics</h1>
              <p>
                View more detailed status about your skateboarding tricks progress. You can view your stats by trick
                type, stance, and more!
              </p>
            </div>
            <Link
              href="/statistics"
              className={`${utilStyles.button} w-full bg-blue-700 text-center text-lg text-neutral-50 outline-blue-500 hover:bg-blue-800 focus:ring-blue-600/50`}
            >
              View detailed stats
            </Link>
          </div>
        </Stats>
      )}

      <Stats
        statsDefinition={globalStatsDef}
        title="Global statistics"
        description="Here are some basic global statistics."
      />

      {session && (
        <TransitionScroll
          hiddenStyle={hiddenStyle}
          baseStyle={baseStyle}
          as="section"
          className="flex flex-col gap-4 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800"
        >
          <div>
            <h1 className="mb-1 text-4xl font-bold">Detailed Statistics</h1>
            <p>
              View more detailed status about your skateboarding tricks progress. You can view your stats by trick type,
              stance, and more!
            </p>
          </div>
          <Link
            href="/statistics"
            className={`${utilStyles.button} self-start bg-blue-700 text-center text-lg text-neutral-50 outline-blue-500 hover:bg-blue-800 focus:ring-blue-600/50`}
          >
            View detailed stats
          </Link>
        </TransitionScroll>
      )}
    </div>
  );
}
