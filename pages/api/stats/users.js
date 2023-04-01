import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import Manual from '../../../models/Manual';
import Combo from '../../../models/Combo';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const grindUserIds = await Grind.distinct('userId');
        const flatgroundTricksUserIds = await FlatgroundTrick.distinct('userId');
        const manualUserIds = await Manual.distinct('userId');
        const comboUserIds = await Combo.distinct('userId');

        console.log(`grindUserIds`, grindUserIds);

        const count = new Set([...grindUserIds, ...flatgroundTricksUserIds, ...manualUserIds, ...comboUserIds]).size;

        res.status(200).json({ success: true, data: { count } });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
