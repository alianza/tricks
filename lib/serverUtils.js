import Combo from '../models/Combo';
import Profile from '../models/Profile';
import { getFullName, populateComboName, populateComboTrickName, sOrNoS } from './commonUtils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Server Side Utils

export const checkForUsedCombos = async (_id, trickType) => {
  const combos = await Combo.countDocuments({ 'trickArray.trick': _id });
  if (combos) throw new Error(`This ${trickType} is used in ${combos} combo${sOrNoS(combos.length)}`);
};

export async function requireAuth(req, res) {
  let session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const authQuery = { userId: session.user.id };
  return { authQuery, session };
}

export async function appRequireAuth() {
  let session = await getServerSession(authOptions);
  if (!session) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const authQuery = { userId: parseInt(session.user.id) };
  return { authQuery, session };
}

export function notFoundHandler(res, { entity, _id, id = _id, label }) {
  return res.status(400).json({ success: false, error: label || `${entity} with id ${id} not found.` });
}

export function appNotFoundHandler({ entity, _id, id = _id, label }) {
  return Response.json({ success: false, error: label || `${entity} with id ${id} not found.` }, { status: 400 });
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
export default async function findAndSerializeDoc(
  model,
  operation,
  query = {},
  { args = [], populateFields = [], fullDoc = false } = {},
) {
  const result = await findDoc(model, operation, query, { args, populateFields, fullDoc });
  return serialize(result);
}

/**
 * Find a document and optionally populate fields
 * @param model {mongoose.Model} - Mongoose model
 * @param operation {function} - Mongoose operation to perform
 * @param query {object} - Query to pass to the operation
 * @param args {array} - Array of arguments to pass to the operation (e.g. sort, limit, etc.)
 * @param populateFields {string[]} - Array of fields to populate
 * @param fullDoc=false {boolean} - Return the full mongo document or a lean js object
 * @returns {Promise<*>} - The result of the operation
 */
const findDoc = async (model, operation, query = {}, { args = [], populateFields = [], fullDoc = false }) => {
  let find = operation.bind(model)(query, ...args);

  if (!fullDoc) find = find.lean();

  if (populateFields.length) populateFields.forEach((field) => (find = find.populate(field)));

  return find.exec();
};

/**
 * Get a trick type and populate the name
 * @param model {mongoose.Model}
 * @param operation {function}
 * @param query {object}
 * @param args {object}
 * @returns {object}
 */
export async function getTricks(model, operation, query = {}, args = []) {
  const tricks = await findDoc(model, operation, query, { ...args });

  if (!tricks) return null;

  const returnTrick = (trick) => ({ ...trick, trick: getFullName(trick, model.collection.collectionName) });
  const data = Array.isArray(tricks) ? tricks.map(returnTrick) : returnTrick(tricks);

  return serialize(data);
}

/**
 * Get a combo and populate the name of every trick in the combo and the name of the combo itself
 * @param model {mongoose.Model}
 * @param operation {function}
 * @param query {object}
 * @param args {array}
 * @returns {object} - The combo
 */
export async function getCombos(model, operation, query = {}, args = []) {
  let combos = await findDoc(model, operation, query, { args, populateFields: ['trickArray.trick'] });

  if (!combos) return null;

  combos = Array.isArray(combos) ? combos.map(populateComboTrickName) : populateComboTrickName(combos); // Populate every trick name in the combo
  combos = Array.isArray(combos) ? combos.map(populateComboName) : populateComboName(combos); // Populate every combo name
  return serialize(combos);
}

/**
 * Gets a profile or creates one if it doesn't exist and returns it
 * @param query {object} - Query to find the profile
 * @returns {Promise<Profile>} - The profile
 */
export const ensureProfile = async (query) =>
  await Profile.findOneAndUpdate(query, {}, { new: true, upsert: true, timestamps: false }).lean();

/**
 * Serialize an object by parsing it to JSON and then back to an object
 * @param obj
 * @returns {object}
 */
export const serialize = (obj) => JSON.parse(JSON.stringify(obj));
