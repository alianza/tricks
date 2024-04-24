import dbConnect, { dbDisconnect } from '../../../../../lib/dbConnect';
import Combo from '../../../../../models/Combo';
import { requireAuth } from '../../../../../lib/serverUtils';
import { TRICK_TYPES_MODELS } from '../../../../../models/constants/trickTypes';

export default async function handler(req, res) {
  const {
    query: { stat },
    body: { trickType },
    method,
  } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'POST':
      switch (stat) {
        case 'average-combo-length':
          try {
            const userCombos = await Combo.find(authQuery).lean();
            const comboLengths = userCombos.map(({ trickArray }) => trickArray.length);
            const averageComboLength = comboLengths.reduce((a, b) => a + b, 0) / comboLengths.length;
            const count = averageComboLength.toFixed(2);
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'grind-combos':
          try {
            const count = await Combo.countDocuments({
              ...authQuery,
              'trickArray.trickRef': TRICK_TYPES_MODELS.grind,
            });
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'manual-combos':
          try {
            const count = await Combo.countDocuments({
              ...authQuery,
              'trickArray.trickRef': TRICK_TYPES_MODELS.manual,
            });
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: `Unhandled endpoint: ${stat}` });
          break;
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${stat}` });
      break;
  }

  await dbDisconnect();
}
