import FLATGROUND_TRICKS, { DIRECTIONS } from '../models/constants/flatgroundTricks';
import STANCES from '../models/constants/stances';

const { ollie, shove_it, kickflip, heelflip, varial_kickflip, varial_heelflip, hardflip, inward_heelflip } =
  FLATGROUND_TRICKS;
const { none, frontside, backside } = DIRECTIONS;
const { regular, fakie, switch: switchStance, nollie } = STANCES;

/**
 * Capitalize the first letter of a string
 * @param value {string | number}
 * @returns {string}
 */
export const capitalize = (value) => value?.toString()?.charAt(0)?.toUpperCase() + value?.toString()?.slice(1);

/**
 * Get the name of a variable
 * @param varObj {{}}
 * @returns {string}
 */
export const VN = (varObj) => Object.keys(varObj)[0];

/**
 * Case-insensitive string inclusion check
 * @param string {string}
 * @param substring {string}
 * @returns {boolean}
 */
export const includesIgnoreCase = (string, substring) => string?.toLowerCase()?.includes(substring?.toLowerCase());

/**
 * Get the full name of a trick
 * @param stance {string}
 * @param direction {string}
 * @param rotation {string|number}
 * @param name {string}
 * @returns {string}
 */
export const getFullTrickName = ({ stance, direction: dir, rotation: rot, name }) => {
  const partRemovalConditions = (part) =>
    !(
      (
        part === none || // Remove 'none' direction
        part === regular || // Remove 'regular' stance
        part === 0 || // Remove 0 rotation
        (stance === nollie && part === ollie)
      ) // Remove 'ollie' trick name if stance is 'nollie' (e.g. 'nollie ollie')
    );

  if ([shove_it, varial_kickflip, varial_heelflip].includes(name) && [180, 360].includes(parseInt(rot, 10))) {
    if (parseInt(rot, 10) === 180) {
      if (name === shove_it) name = 'bigspin';
      if (name === varial_kickflip && (dir === backside || (stance === nollie && dir === frontside)))
        name = 'bigspin kickflip';
      if (name === varial_heelflip && (dir === frontside || (stance === nollie && dir === backside)))
        name = 'bigspin heelflip';
    }
    if (parseInt(rot, 10) === 360) {
      if (name === shove_it) name = 'biggerspin';
      if (name === varial_kickflip && (dir === backside || (stance === nollie && dir === frontside)))
        name = 'biggerflip';
      if (name === varial_heelflip && (dir === frontside || (stance === nollie && dir === backside)))
        name = 'biggerheel';
    }
    rot = 0; // Remove rotation from name
    dir = 'none'; // Remove direction from name
  }

  name = name.split(' ').map(capitalize).join(' '); // capitalize every word in the trick name

  return [stance, dir, parseInt(rot, 10), name].filter(partRemovalConditions).map(capitalize).join(' ');
};

/**
 * Get the full name of a grind
 * @param stance {string}
 * @param direction {string}
 * @param name {string}
 * @returns {string}
 */
export const getFullGrindName = ({ stance, direction, name }) => {
  const partRemovalConditions = (part) => !(part === 'none' || part === 'regular');
  return [stance, direction, name].filter(partRemovalConditions).map(capitalize).join(' ');
};

/**
 * Get the full name of a combo
 * @param trickArray {array} - Array of tricks
 * @param combo {string} - Name of the combo
 * @returns {string}
 */
export const getFullComboName = ({ trickArray, combo = '' }) => {
  if (combo) return combo;

  return trickArray.reduce((name, { trick, trickRef }, index) => {
    const nextTrick = trickArray[index + 1];
    const previousTrick = trickArray[index - 1];

    name += trick;

    if (previousTrick && !includesIgnoreCase(previousTrick.trickRef, 'flatground')) {
      name += includesIgnoreCase(trickRef, 'flatground') ? ` out` : ` `;
    }

    if (nextTrick) {
      name += !includesIgnoreCase(nextTrick.trickRef, 'flatground') ? ` to ` : ` `;
    }

    return name;
  }, '');
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

export const populateComboName = (combo) => ({ ...combo, trick: getFullComboName({ trickArray: combo.trickArray }) });

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
 * Whether to add an 's' to a word depending on the value of a number representing an amount
 * @param amount {number} - The quantity of something
 * @returns {string} - and S or an empty string
 */
export const sOrNoS = (amount) => (amount > 1 || amount === 0 ? 's' : '');

/**
 * Compare two objects to see if they are equal (shallow)
 * @param object1 {object}
 * @param object2 {object}
 * @returns {boolean}
 */
export function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => object1[key] === object2[key]);
}

/**
 * Compare two objects to see if they are equal (deep)
 * @param object1 {object}
 * @param object2 {object}
 * @returns {boolean}
 */
export function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const val1 = object1[key];
    const val2 = object2[key];

    const areObjects = isObject(val1) && isObject(val2);
    return areObjects ? deepEqual(val1, val2) : val1 === val2;
  });
}

/**
 * Check if a variable is an object
 * @param object {*} - Variable to check
 * @returns {boolean} - Whether the variable is an object
 */
export function isObject(object) {
  return object != null && typeof object === 'object';
}

/**
 * Check if a variable is a string
 * @param val {*} - Variable to check
 * @returns {boolean} - Whether the variable is a string or not
 */
export const isString = (val) => typeof val === 'string';

/**
 * Omit properties from an object
 * @param object {object} - Object to omit properties from
 * @param keys {array} - Array of keys to omit from the object
 * @returns {{}} - Object with omitted properties removed
 */
export function omit(object, keys) {
  if (!object) return {};
  return Object.keys(object)
    .filter((key) => !keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = object[key];
      return acc;
    }, {});
}

/**
 * Get the value of a nested object property
 * @param object {object} - Object to get the value from
 * @param path {string} - Path to the property (e.g. 'foo.bar.baz')
 * @returns {*} - Value of the property
 */
export const deepGet = (object, path) => {
  const keys = path.split('.');
  if (!keys.length) return object; // if path is empty string return object
  if (keys.length === 1) return object[keys[0]]; // if path is one key return object[key]
  let value = object;
  keys.forEach((key) => (value = isObject(value) ? value[key] : undefined));
  return value;
};

/**
 * A function that throttles the execution of a function
 * @param func - The function to throttle
 * @param wait - The time to wait between executions in milliseconds
 * @param options {{leading: boolean, trailing: boolean}} - Options for the throttle
 * @returns {function(): *}
 */
export function throttle(func, wait, options = {}) {
  let timeout, context, args, result;
  let previous = 0;

  const later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };

  const throttled = function () {
    const _now = Date.now();
    if (!previous && options.leading === false) previous = _now;
    const remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

/**
 * A function that performs a string comparison with a fuzzy ratio
 * @param string {string} - The string to compare
 * @param term {string} - The term to compare the string to
 * @param ratio {number} - The ratio to compare the string to the term (0-1) where 1 is a perfect match
 * @returns {boolean} - Whether the string matches the term
 */
export const fuzzy = (string = '', term = '', ratio) => {
  const compare = term.toLowerCase().replaceAll(' ', '');
  string = string.toLowerCase().replaceAll(' ', '');
  let matches = 0;

  if (string.indexOf(compare) > -1) return true; // covers basic partial matches
  for (let i in compare) string.indexOf(compare[i]) > -1 ? (matches += 1) : (matches -= 1);
  return matches / string.length >= ratio || term === '';
};

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
