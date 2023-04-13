import dbConnect from '../../../../lib/dbConnect';
import { ensureProfile, requireAuth, notFoundHandler } from '../../../../lib/serverUtils';
import { authOptions } from '../../auth/[...nextauth]';
import Profile from '../../../../models/Profile';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res, authOptions);

  switch (method) {
    case 'GET':
      try {
        const profile = await ensureProfile({ ...authQuery });
        res.status(200).json({ success: true, data: profile });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PATCH':
      try {
        const profile = await Profile.findOneAndUpdate({ ...authQuery }, req.body, { new: true });
        if (!profile) return notFoundHandler(res, { label: 'Profile not found...' });
        res.status(200).json({ success: true, data: profile });
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
