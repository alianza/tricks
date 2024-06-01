import dbConnect from '../../../lib/dbConnect';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import { getFullGrindName, getFullManualName, getFullTrickName } from '../../../lib/commonUtils';
import { requireAuth } from '../../../lib/serverUtils';
import Grind from '../../../models/Grind';
import Manual from '../../../models/Manual';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const where = { ...authQuery };

        if (query.countOnly === 'true') {
          const count = await FlatgroundTrick.countDocuments({ ...authQuery, ...extraQuery });
          return res.status(200).json({ success: true, data: count });
        }

        const flatgroundTricks = await FlatgroundTrick.find({ ...authQuery, ...extraQuery }).lean();
        const flatgroundTricksData = flatgroundTricks.map((flatgroundTrick) => ({
          ...flatgroundTrick,
          trick: getFullTrickName(flatgroundTrick),
        }));

        const grinds = await Grind.find({ ...authQuery, ...extraQuery }).lean();
        const grindsData = grinds.map((grind) => ({ ...grind, trick: getFullGrindName(grind) }));

        const manuals = await Manual.find({ ...authQuery, ...extraQuery }).lean();
        const manualsData = manuals.map((manual) => ({ ...manual, trick: getFullManualName(manual) }));

        res.status(200).json({ success: true, data });
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
