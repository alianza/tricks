import Link from 'next/link';
import utilStyles from '../styles/utils.module.scss';
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  ChartBarIcon,
  HomeIcon,
  PlusIcon,
  Squares2X2Icon,
  UserIcon
} from '@heroicons/react/24/solid';
import { signIn, signOut } from 'next-auth/react';

/**
 * Perform an API call on Next.js Api routes using fetch with default options & error handling
 * @param endpoint {string} - The endpoint to call
 * @param [data] {object} - The data to send
 * @param [body] {string} - The body to send (defaults to JSON.stringify(data))
 * @param [_id] {string} - The id to use in the endpoint
 * @param [id] {string} - The id to use in the endpoint (defaults to _id)
 * @param [method] { 'GET' | 'POST' | 'PATCH' | 'DELETE' } - The HTTP method to use
 * @param [errorMessage] {string} - The error message to throw if the response is not ok
 * @param [headers] {object} - The headers to send (defaults to { Accept: 'application/json', 'Content-Type': 'application/json' })
 * @param throwOnNotOk {boolean} Whether to throw an error if the response is not ok
 * @param [searchParams] {URLSearchParams} - The search parameters to append to the URL
 * @returns {Promise<any>}
 */
export const apiCall = async (
  endpoint,
  {
    data,
    body = JSON.stringify(data),
    _id = '',
    id = _id,
    method = 'GET',
    errorMessage = '',
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' },
    throwOnNotOk = true,
    searchParams = new URLSearchParams(),
  } = {},
) => {
  try {
    let url = id ? `/api/${endpoint}/${id}` : `/api/${endpoint}`;

    if (searchParams.size) url += `?${searchParams}`;

    const response = await fetch(url, { method, headers, body });

    if (!response.ok) {
      const { error } = errorMessage ? { error: errorMessage } : await response.json();
      if (throwOnNotOk) throw new Error(error);
      return { error };
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export function getCommonActions(endpoint, excludeActions = []) {
  const { button, green, red, blue } = utilStyles;
  const defaultActions = [
    {
      edit: (obj) => (
        <Link
          href={`/${endpoint}/${obj._id}/edit`}
          className={`${button} ${green} !rounded-none md:!rounded -md:!p-1 -md:ring-inset`}
        >
          Edit
        </Link>
      ),
    },
    {
      view: (obj) => (
        <Link
          href={`/${endpoint}/${obj._id}`}
          className={`${button} ${blue} !rounded-none md:!rounded -md:!p-1 -md:ring-inset`}
        >
          View
        </Link>
      ),
    },
    {
      delete: () => (
        <button className={`${button} ${red} !rounded-none md:!rounded -md:!p-1 -md:ring-inset`}>Delete</button>
      ),
    },
  ];
  if (!excludeActions.length) return defaultActions;
  return defaultActions.filter((action) => !Object.keys(action).some((key) => excludeActions.includes(key)));
}

export const trickCol = { trick: { alias: 'Trick Name', className: 'text-sm font-bold' } };

export const landedAtCol = { landedAt: { alias: 'Date landed', formatDate: true } };

export const baseStyle = { transitionDuration: '650ms', transitionTimingFunction: 'ease-out' };

export const hiddenStyle = { opacity: 0, transform: 'translateY(3em)', filter: 'blur(4px)' };

export const navItems = {
  home: { label: 'Home', href: '/', icon: <HomeIcon className="size-6" /> },
  dashboard: {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Squares2X2Icon className="size-6" />,
  },
  profile: { label: 'Profile', href: '/profile', icon: <UserIcon className="size-6" /> },
  new: {
    label: 'Add New...',
    icon: <PlusIcon className="size-6" />,
    children: [
      { label: 'Flatground Trick', href: '/new-flatground-trick' },
      { label: 'Grind', href: '/new-grind' },
      { label: 'Manual', href: '/new-manual' },
      { label: 'Combo', href: '/new-combo' },
    ],
  },
  stats: {
    label: 'Statistics',
    href: '/statistics',
    icon: <ChartBarIcon className="size-6" />,
  },
  signIn: {
    label: 'Sign In',
    href: '#',
    onClick: () => signIn(),
    icon: <ArrowLeftEndOnRectangleIcon className="size-6" />,
  },
  signOut: {
    label: 'Sign Out',
    href: '#',
    onClick: () => signOut(),
    icon: <ArrowLeftStartOnRectangleIcon className="size-6" />,
  },
};

/**
 * Get the key and value of an event from an HTML input element
 * @param {InputEvent} e - The input event object
 * @returns {{[key: string]: (string|boolean)}} An object with the name of the input element as the key and its value as the value
 */
export const getEventKeyValue = (e) => {
  const { target } = e;
  const { name } = target;
  let { value } = target;
  if (target.type === 'checkbox') value = target.checked;
  return { [name]: value };
};

/**
 * Get the name, value, and target of an event
 * @param {InputEvent} e - The event object
 * @returns {{name: string, value: (string|boolean), target: EventTarget}} The name, value, and target of the event
 */
export const getEventNameValue = (e) => {
  const { target } = e;
  const { type, name } = target;
  let { value } = target;
  if (type === 'checkbox') value = target.checked;
  return { name, value, target };
};

export const stanceSelectOptions = (
  <>
    <option defaultValue value="all">
      All Stances
    </option>
    <hr />
    <option value="regular">Regular</option>
    <option value="fakie">Fakie</option>
    <option value="switch">Switch</option>
    <option value="nollie">Nollie</option>
  </>
);
export const directionSelectOptions = (
  <>
    <option defaultValue value="all">
      All Directions
    </option>
    <hr />
    <option value="frontside">Frontside</option>
    <option value="backside">Backside</option>
    <option value="none">No direction</option>
  </>
);

/**
 * Trigger a shallow router reload in order to trigger the Nprogress loader
 * @param router {Object} - The Next.js router object
 * @returns {*}
 */
export const triggerLoader = (router) => router.push({ pathname: router.asPath }, undefined, { shallow: true });
