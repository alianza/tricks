import Combo from '../models/Combo';
import { getFullName, populateComboName, populateComboTrickName, sOrNoS } from './commonUtils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

// Server Side Utils

export const checkForUsedCombos = async (_id, trickType) => {
  const combos = await Combo.countDocuments({ 'trickArray.trick': _id });

  if (combos) throw new Error(`This ${trickType} is used in ${combos} combo${sOrNoS(combos)}`);
};

export async function loginBarrier(req, res) {
  let session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const authQuery = { userId: session.user.id };
  return { authQuery, session };
}

export function notFoundHandler(res, { entity, _id, id = _id }) {
  return res.status(400).json({ success: false, error: `${entity} with id ${id} not found.` });
}

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

  if (populateFields.length > 0) populateFields.forEach((field) => (find = find.populate(field)));

  return await find.exec();
};

/**
 * Get a trick type and populate the name
 * @param model {mongoose.Model}
 * @param operation {function}
 * @param query {object}
 * @param options {object}
 * @returns {object}
 */
export async function getTricks(model, operation, query = {}, options = {}) {
  const tricks = await findDoc({ model, operation, query, options });

  const returnTrick = (trick) => ({ ...trick, trick: getFullName(trick, model.collection.collectionName) });
  const data = Array.isArray(tricks) ? tricks.map(returnTrick) : returnTrick(tricks);

  return serialize(data);
}

export async function getCombos(model, operation, query = {}, options = {}) {
  let combos = await findDoc({ model, operation, query, options, populateFields: ['trickArray.trick'] });
  combos = combos.map(populateComboTrickName); // Populate every trick name in the combo
  combos = combos.map(populateComboName); // Populate every combo name
  return serialize(combos);
}

/**
 * Serialize an object by parsing it to JSON and then back to an object
 * @param obj
 * @returns {object}
 */
const serialize = (obj) => JSON.parse(JSON.stringify(obj));
