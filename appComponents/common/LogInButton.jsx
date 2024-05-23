'use client';

import { signIn } from 'next-auth/react';
import utilStyles from '@/styles/utils.module.scss';

function LogInButton() {
  return (
    <button
      onClick={() => signIn()}
      className={`${utilStyles.button} w-full bg-gray-700 text-lg text-neutral-50 outline-gray-500 hover:bg-gray-800 focus:ring-gray-600/50 dark:bg-gray-300 dark:text-neutral-900 hover:dark:bg-gray-400`}
    >
      Sign in to get started!
    </button>
  );
}

export default LogInButton;
