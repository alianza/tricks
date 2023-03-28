import { signIn, useSession } from 'next-auth/react';
import utilStyles from '../styles/utils.module.scss';
import Link from 'next/link';

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

const Index = ({}) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-16">
      <section class="hero mb-8 rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800">
        <h1 class="mb-4 text-4xl font-bold">Track Your Skateboarding Tricks Progress</h1>
        <p class="mb-4">
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
    </div>
  );
};

export default Index;
