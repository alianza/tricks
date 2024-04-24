import dbConnect, { dbDisconnect } from '../../../../../lib/dbConnect';
import Combo from '../../../../../models/Combo';
import FlatgroundTrick from '../../../../../models/FlatgroundTrick';
import Grind from '../../../../../models/Grind';
import Manual from '../../../../../models/Manual';
import { requireAuth } from '../../../../../lib/serverUtils';
import { STANCES } from '../../../../../models/constants/stances';
import TRICK_TYPES from '../../../../../models/constants/trickTypes';
const { combo: COMBO, flatground: FLATGROUND, manual: MANUAL, grind: GRIND } = TRICK_TYPES;

const { regular, fakie, nollie, switch: switchStance } = STANCES;

const getStanceCount = async (stance, query, trickType = 'all') => {
  const includeTrickType = (desiredType) => trickType === desiredType || trickType === 'all';
  const getTrickTypeCount = async (model, query, trickType, desiredType) =>
    includeTrickType(desiredType) ? await model.countDocuments(query) : 0;

  const flatgroundTrickCount = await getTrickTypeCount(FlatgroundTrick, { stance, ...query }, trickType, FLATGROUND);
  const grindCount = await getTrickTypeCount(Grind, { stance, ...query }, trickType, GRIND);
  const manualCount = await getTrickTypeCount(Manual, { stance, ...query }, trickType, MANUAL);
  const userCombos = includeTrickType(COMBO) ? await Combo.find(query).populate('trickArray.trick').lean() : []; // for combo's we need to check the stance of the first trick in the trickArray which are nested documents in the combo document, so we need to populate them to access their properties
  const filteredCombos = userCombos.filter(({ trickArray }) => trickArray[0].trick.stance === stance) || [];
  const comboCount = filteredCombos.length;
  return flatgroundTrickCount + grindCount + manualCount + comboCount;
};

export default async function handler(req, res) {
  const {
    query: { stance },
    body: { trickType },
    method,
  } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'POST':
      switch (stance) {
        case regular:
        case fakie:
        case nollie:
        case switchStance:
          try {
            const count = await getStanceCount(stance, authQuery, trickType);
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: `Unhandled endpoint: ${stance}` });
          break;
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${stance}` });
      break;
  }

  await dbDisconnect();
}
