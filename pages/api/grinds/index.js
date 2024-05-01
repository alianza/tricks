import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';
import { getFullGrindName } from '../../../lib/commonUtils';
import { requireAuth } from '../../../lib/serverUtils';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const extraQuery = { ...(query.landedOnly !== undefined && { landed: true }) };
        const grinds = await Grind.find({ ...authQuery, ...extraQuery }).lean();
        const data = grinds.map((grind) => ({ ...grind, trick: getFullGrindName(grind) }));
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const grind = await Grind.create({ ...req.body, ...authQuery });
        res.status(201).json({ success: true, data: grind });
      } catch (error) {
        if (error.code === 11000) {
          error.message = 'This Grind already exists'; // Return code for unique index constraint violation
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
