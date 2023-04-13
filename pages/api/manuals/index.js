import dbConnect from '../../../lib/dbConnect';
import Manual from '../../../models/Manual';
import { getFullManualName } from '../../../lib/commonUtils';
import { authOptions } from '../auth/[...nextauth]';
import { requireAuth } from '../../../lib/serverUtils';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res, authOptions);

  switch (method) {
    case 'GET':
      try {
        const manuals = await Manual.find({ ...authQuery }).lean();
        const data = manuals.map((manual) => ({ ...manual, trick: getFullManualName(manual) }));
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const manual = await Manual.create({ ...req.body, ...authQuery });
        res.status(201).json({ success: true, data: manual });
      } catch (error) {
        if (error.code === 11000) {
          error.message = 'This manual already exists'; // Return code for unique index constraint violation
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
