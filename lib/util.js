export default async function findAndSerializeDoc(model, operation, query, options = {}) {
  const result = await operation.bind(model)(query, options).lean();
  return JSON.parse(JSON.stringify(result));
}

export const capitalize = (value) => value?.toString().charAt(0).toUpperCase() + value?.toString().slice(1);

/**
 * Get the name of a variable
 * @param varObj
 * @returns {string}
 */
export const VN = (varObj) => Object.keys(varObj)[0];

export const getFullTrickName = ({ stance, direction, rotation, name }) => {
  const partRemovalCondition = (part) => !(part === 'none' || part === 'regular' || part === 0);
  return [stance, direction, parseInt(rotation), name].filter(partRemovalCondition).map(capitalize).join(' ');
};

export const getFullGrindName = ({ stance, direction, name }) => {
  const partRemovalCondition = (part) => !(part === 'none' || part === 'regular');
  return [stance, direction, name].filter(partRemovalCondition).map(capitalize).join(' ');
};

export const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json);
