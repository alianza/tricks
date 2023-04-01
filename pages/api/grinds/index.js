import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';
import { getFullGrindName } from '../../../lib/util';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const authQuery = { userId: session.user.id };

  switch (method) {
    case 'GET':
      try {
        const grinds = await Grind.find({ ...authQuery }).lean();
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
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
