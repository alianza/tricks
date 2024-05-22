import dbConnect from '../../../lib/dbConnect';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import { getFullTrickName } from '@/lib/commonUtils';
import { requireAuth } from '@/lib/serverUtils';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const extraQuery = { ...(query.landedOnly !== undefined && { landed: true }) };

        if (query.countOnly !== undefined) {
          const count = await FlatgroundTrick.countDocuments({ ...authQuery, ...extraQuery });
          return res.status(200).json({ success: true, data: count });
        }

        const flatgroundTricks = await FlatgroundTrick.find({ ...authQuery, ...extraQuery }).lean();
        const data = flatgroundTricks.map((flatgroundTrick) => ({
          ...flatgroundTrick,
          trick: getFullTrickName(flatgroundTrick),
        }));
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const flatgroundTrick = await FlatgroundTrick.create({ ...req.body, ...authQuery });
        res.status(201).json({ success: true, data: flatgroundTrick });
      } catch (error) {
        if (error.code === 11000) {
          error.message = 'This Flatground Trick already exists'; // Return code for unique index constraint violation
        }
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
