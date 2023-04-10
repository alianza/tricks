import { signIn, useSession } from 'next-auth/react';
import utilStyles from '../styles/utils.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiCall } from '../lib/commonUtils';
import { toast } from 'react-toastify';
import Loader from '../components/common/loader/loader';

const statsDef = {
  flatgroundtricks: { label: 'Flatground Tricks', endpoint: '/mine/flatgroundtricks', value: '...' },
  grinds: { label: 'Grinds', endpoint: '/mine/grinds', value: '...' },
  manuals: { label: 'Manuals', endpoint: '/mine/manuals', value: '...' },
  combos: { label: 'Combos', endpoint: '/mine/combos', value: '...' },
};

const globalStatsDef = {
  flatgroundtricks: { label: 'Flatground Tricks', endpoint: '/flatgroundtricks', value: '...' },
  grinds: { label: 'Grinds', endpoint: '/grinds', value: '...' },
  manuals: { label: 'Manuals', endpoint: '/manuals', value: '...' },
  combos: { label: 'Combos', endpoint: '/combos', value: '...' },
  users: { label: 'Users', endpoint: '/users', value: '...' },
};

const Index = () => {
  const { data: session } = useSession();

  const [stats, setStats] = useState(
    Object.fromEntries(Object.values(statsDef).map(({ label, value }) => [label, value]))
  );
  const [globalStats, setGlobalStats] = useState(
    Object.fromEntries(Object.values(globalStatsDef).map(({ label, value }) => [label, value]))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!session) return;
      try {
        setLoading(true);
        const response = await Promise.all(
          Object.values(statsDef).map(({ endpoint }) => apiCall(`stats/${endpoint}`, { method: 'GET' }))
        );

        setStats({
          ...Object.fromEntries(Object.values(statsDef).map(({ label }, index) => [label, response[index].data.count])),
        });
      } catch (e) {
        toast.error('Failed to fetch your stats. Please try again later...');
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await Promise.all(
          Object.values(globalStatsDef).map(({ endpoint }) => apiCall(`stats/${endpoint}`, { method: 'GET' }))
        );

        setGlobalStats({
          ...Object.fromEntries(
            Object.values(globalStatsDef).map(({ label }, index) => [label, response[index].data.count])
          ),
        });
      } catch (e) {
        toast.error('Failed to fetch global stats. Please try again later...');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section className="mb-8 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800">
        <h1 className="mb-4 text-4xl font-bold">Track Your Skateboarding Tricks Progress</h1>
        <p className="mb-4">
          Keep track of the tricks you've learned and the ones you want to master. Set goals and track your progress
          over time.
        </p>
        {!session ? (
          <button
            onClick={() => signIn()}
            className={`${utilStyles.button} w-full bg-gray-700 text-lg text-neutral-50 outline-gray-500 hover:bg-gray-800 focus:ring-gray-600/50 dark:bg-gray-300 dark:!text-neutral-900 hover:dark:bg-gray-400`}
          >
            Sign in to get started!
          </button>
        ) : (
          <Link
            href="/dashboard"
            className={`${utilStyles.button} block w-full bg-blue-700 text-center text-lg text-blue-50 outline-blue-500 hover:bg-blue-800 focus:ring-blue-600/50`}
          >
            Go to your dashboard!
          </Link>
        )}
      </section>

      {stats && (
        <section className="mb-8 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800">
          <h1 className="mb-4 text-4xl font-bold">Your stats</h1>
          <p className="my-4">Here are some basic statistics about your progress.</p>
          <div className="grid grid-cols-1 gap-8 rounded-lg bg-neutral-200 p-4 dark:bg-neutral-700 sm:grid-cols-2">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <h2 className="text-center text-2xl font-bold">{key}</h2>
                <p className="text-center text-4xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {globalStats && (
        <section className="mb-8 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800">
          <h1 className="mb-4 text-4xl font-bold">Global stats</h1>
          <p className="my-4">Here are some basic global statistics.</p>
          <div className="grid grid-cols-1 gap-8 rounded-lg bg-neutral-200 p-4 dark:bg-neutral-700 sm:grid-cols-2">
            {Object.entries(globalStats).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2 last:odd:col-span-2">
                <h2 className="text-center text-2xl font-bold">{key}</h2>
                <p className="text-center text-4xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading && <Loader className="mx-auto" />}
    </div>
  );
};

export default Index;
