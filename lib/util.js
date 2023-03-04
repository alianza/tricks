/**
 * Perform an operation on a model and serialize the result
 * @param model {mongoose.Model}
 * @param operation {function}
 * @param query {object}
 * @param options {object}
 * @param populateFields {string[]}
 * @returns {{}}
 */
export default async function findAndSerializeDoc({ model, operation, query = {}, options = {}, populateFields = [] }) {
  const result = await findDoc({ model, operation, query, options, populateFields });
  return serialize(result);
}

const findDoc = async ({ model, operation, query = {}, options = {}, populateFields = {} }) => {
  let find = operation.bind(model)(query, options).lean();

  if (populateFields.length > 0) {
    populateFields.forEach((field) => {
      find = find.populate(field);
    });
  }

  return await find.exec();
};

export const populateCombosTricksNames = (combos) => {
  return combos.map((combo) => {
    const trickArray = combo.trickArray.map(({ trick, trickRef }) => {
      return {
        ...trick,
        trick: getFullName(trick, trickRef),
        trickRef,
      };
    });
    return { ...combo, trickArray };
  });
};

export async function getTricks(model, operation, query = {}, options = {}) {
  const tricks = await findDoc({ model, operation, query, options });

  if (Array.isArray(tricks)) {
    return serialize(
      tricks.map((trick) => ({
        ...trick,
        trick: getFullName(trick, model.collection.collectionName),
      }))
    );
  } else {
    return serialize({
      ...tricks,
      trick: getFullName(tricks, model.collection.collectionName),
    }); // Single trick
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

/**
 * Get the full name of a manoeuvre (trick or grind)
 * @param manoeuvre
 * @param type
 * @returns {string}
 */
export const getFullName = (manoeuvre, type) => {
  if (!manoeuvre) return '';

  if (type.toLowerCase().includes('grind')) {
    return getFullGrindName(manoeuvre);
  } else if (type.toLowerCase().includes('flatground')) {
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
    errorMessage,
    headers = { Accept: 'application/json', 'Content-Type': 'application/json' },
  }
) => {
  const response = await fetch(`/api/${endpoint}/${id}`, { method, headers, body });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(errorMessage || error);
  }

  return await response.json();
};
