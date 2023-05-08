import Link from 'next/link';
import utilStyles from '../styles/utils.module.scss';

/**
 * Return fetcher for use with SWR
 * @param url {string}
 * @returns {{}}
 */
export const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json);

/**
 * Format an ISO date string to dd-mm-yyyy and optionally include the time
 * @param ISODate {string}
 * @param includeTime {boolean}
 * @returns {string} - Formatted date string
 */
export const formatDate = (ISODate, { includeTime = false } = {}) => {
  const date = new Date(ISODate);
  const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  if (!includeTime) return dateString;
  const timeString = `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  return dateString + ' ' + timeString;
};

/**
 * Perform an API call on Next.js Api routes using fetch with default options & error handling
 * @param endpoint {string}
 * @param [data] {object}
 * @param [body] {string}
 * @param [_id] {string}
 * @param [id] {string}
 * @param [method] { 'GET' | 'POST' | 'PATCH' | 'DELETE' }
 * @param [errorMessage] {string}
 * @param [headers] {object}
 * @param errorOnNotOk {boolean} Whether to throw an error if the response is not ok
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
    errorOnNotOk = true,
  } = {}
) => {
  const response = await fetch(`/api/${endpoint}/${id}`, { method, headers, body });

  if (!response.ok && errorOnNotOk) {
    const { error } = await response.json();
    throw new Error(errorMessage || error);
  }

  return await response.json();
};

export function getCommonActions(endpoint, excludeActions = []) {
  const { button, green, red, blue } = utilStyles;
  const defaultActions = [
    {
      edit: (obj) => (
        <Link href={`/${endpoint}/${obj._id}/edit`} className={`${button} ${green}`}>
          Edit
        </Link>
      ),
    },
    {
      view: (obj) => (
        <Link href={`/${endpoint}/${obj._id}`} className={`${button} ${blue}`}>
          View
        </Link>
      ),
    },
    { delete: () => <button className={`${button} ${red}`}>Delete</button> },
  ];
  if (!excludeActions.length) return defaultActions;
  return defaultActions.filter((action) => !Object.keys(action).some((key) => excludeActions.includes(key)));
}

export const trickCol = { trick: { alias: 'Trick Name', className: 'text-sm font-bold' } };
