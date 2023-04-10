/**
 * Capitalize the first letter of a string
 * @param value {string | number}
 * @returns {string}
 */
export const capitalize = (value) => value?.toString().charAt(0).toUpperCase() + value?.toString().slice(1);

/**
 * Get the name of a variable
 * @param varObj {{}}
 * @returns {string}
 */
export const VN = (varObj) => Object.keys(varObj)[0];

/**
 * Case-insensitive string inclusion check
 */
export const includesIgnoreCase = (string, substring) => string.toLowerCase().includes(substring.toLowerCase());

/**
 * Get the full name of a trick
 * @param stance {string}
 * @param direction {string}
 * @param rotation {string|number}
 * @param name {string}
 * @returns {string}
 */
export const getFullTrickName = ({ stance, direction, rotation, name }) => {
  const partRemovalCondition = (part) =>
    !(part === 'none' || part === 'regular' || part === 0 || (stance === 'nollie' && part === 'ollie'));
  return [stance, direction, parseInt(rotation, 10), name].filter(partRemovalCondition).map(capitalize).join(' ');
};

/**
 * Get the full name of a grind
 * @param stance {string}
 * @param direction {string}
 * @param name {string}
 * @returns {string}
 */
export const getFullGrindName = ({ stance, direction, name }) => {
  const partRemovalCondition = (part) => !(part === 'none' || part === 'regular');
  return [stance, direction, name].filter(partRemovalCondition).map(capitalize).join(' ');
};

/**
 * Get the full name of a combo
 * @param trickArray {array}
 * @param trick {string|null|undefined}
 * @returns {*}
 */
export const getFullComboName = ({ trickArray, combo = null }) => {
  if (combo) return combo;
  const trickNamesTypes = trickArray.map(({ trick, trickRef }) => ({ trick, trickRef })); // Map all trick names to their type

  const comboNameArray = trickNamesTypes.map(({ trick, trickRef }, index) => {
    if (
      // if next trick is the last trick, and that's a flatground trick
      index === trickNamesTypes.length - 2 &&
      includesIgnoreCase(trickNamesTypes[index + 1].trickRef, 'flatground')
    ) {
      return `${trick}`;
    }
    if (
      // last trick
      index ===
      trickNamesTypes.length - 1
    ) {
      return includesIgnoreCase(trickRef, 'flatground') ? `${trick} out` : `${trick}`;
    }
    return `${trick} to`;
  });
  return comboNameArray.join(' ');
};

export const getFullManualName = ({ type }) => capitalize(type);

/**
 * Get the full name of a manoeuvre (trick or grind)
 * @param manoeuvre
 * @param type
 * @returns {string}
 */
export const getFullName = (manoeuvre, type) => {
  if (!manoeuvre) return '';

  type = type.toLowerCase();

  if (type.includes('grind')) {
    return getFullGrindName(manoeuvre);
  } else if (type.includes('flatground')) {
    return getFullTrickName(manoeuvre);
  } else if (type.includes('manual')) {
    return getFullManualName(manoeuvre);
  } else if (type.includes('combo')) {
    return getFullComboName(manoeuvre);
  }
};

export const populateComboTrickName = (combo) => {
  const trickArray = combo.trickArray.map(({ trick, trickRef }) => ({
    ...trick,
    trick: getFullName(trick, trickRef),
    trickRef,
  }));
  return { ...combo, trickArray };
};

export const populateComboName = (combo) => ({ ...combo, combo: getFullComboName({ trickArray: combo.trickArray }) });

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

/**
 * Whether to add an 's' to a word depending on the value of a number representing an amount
 * @param value {number}
 * @returns {string}
 */
export const sOrNoS = (value) => (value > 1 ? 's' : '');