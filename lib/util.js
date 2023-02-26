/**
 * Perform an operation on a model and serialize the result
 * @param model {mongoose.Model}
 * @param operation {function}
 * @param query {object}
 * @param options {object}
 * @returns {{}}
 */
export default async function findAndSerializeDoc(model, operation, query = {}, options = {}) {
  const result = await operation.bind(model)(query, options).lean();
  return serialize(result);
}

export async function getTricks(model, operation, query = {}, options = {}) {
  const tricks = await operation.bind(model)(query, options).lean();

  const setTrickName = (trick) => {
    trick.trick = getFullName(trick, model.collection.collectionName);
    return trick;
  };

  if (Array.isArray(tricks)) {
    return serialize(tricks.map((trick) => setTrickName(trick)));
  } else {
    return serialize(setTrickName(tricks));
  }
}

/**
 * Serialize an object by parsing it to JSON and then back to an object
 * @param obj
 * @returns {any}
 */
const serialize = (obj) => JSON.parse(JSON.stringify(obj));

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
 * Get the full name of a trick
 * @param stance {string}
 * @param direction {string}
 * @param rotation {string|number}
 * @param name {string}
 * @returns {string}
 */
export const getFullTrickName = ({ stance, direction, rotation, name }) => {
  const partRemovalCondition = (part) => !(part === 'none' || part === 'regular' || part === 0);
  return [stance, direction, parseInt(rotation), name].filter(partRemovalCondition).map(capitalize).join(' ');
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

export const getFullName = (manoeuvre, type) => {
  if (type.includes('grind')) {
    return getFullGrindName(manoeuvre);
  } else if (type.includes('flatgroundtrick')) {
    return getFullTrickName(manoeuvre);
  }
};

/**
 * Return fetcher for use with SWR
 * @param url {string}
 * @returns {{}}
 */
export const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json);
