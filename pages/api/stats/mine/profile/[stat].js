import dbConnect from '../../../../../lib/dbConnect';
import { requireAuth } from '../../../../../lib/serverUtils';
import Profile from '../../../../../models/Profile';
import { formatDate } from '../../../../../lib/commonUtils';

export default async function handler(req, res) {
  const {
    query: { stat },
    method,
  } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'POST':
      switch (stat) {
        case 'register-date':
          try {
            const account = await Profile.findOne(authQuery).select('createdAt').lean();
            const count = formatDate(account.createdAt);
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'account-age':
          try {
            const account = await Profile.findOne(authQuery).select('createdAt').lean();
            const count = Math.floor((Date.now() - account.createdAt) / (1000 * 60 * 60 * 24));
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
}
