import Combo from '../../models/Combo';
import { sOrNoS } from '../../lib/util';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

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
