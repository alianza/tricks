import dbConnect from '../../../lib/dbConnect';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import { getFullTrickName } from '../../../lib/util';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  console.log(`Api route session`, session);

  switch (method) {
    case 'GET':
      try {
        const flatgroundTricks = await FlatgroundTrick.find({}).lean();
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
        const flatgroundTrick = await FlatgroundTrick.create(req.body);
        res.status(201).json({ success: true, data: flatgroundTrick });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
