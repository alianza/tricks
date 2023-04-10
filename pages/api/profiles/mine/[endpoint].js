import dbConnect from '../../../../lib/dbConnect';
import { loginBarrier, notFoundHandler } from '../../../../lib/serverUtils';
import { authOptions } from '../../auth/[...nextauth]';
import Profile from '../../../../models/Profile';

export default async function handler(req, res) {
  const {
    query: { endpoint },
    method,
  } = req;

  await dbConnect();
  const { authQuery } = await loginBarrier(req, res, authOptions);

  switch (method) {
    case 'GET':
      switch (endpoint) {
        case '/':
          try {
            const profile = await Profile.findOneAndUpdate({ ...authQuery }, {}, { new: true, upsert: true });
            res.status(200).json({ success: true, data: profile });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'preferred_stance':
          try {
            const profile = await Profile.findOneAndUpdate({ ...authQuery }, {}, { new: true, upsert: true });
            res.status(200).json({ success: true, data: { preferred_stance: profile.preferred_stance } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: `Unhandled endpoint: ${endpoint}` });
          break;
      }
      break;
    case 'PATCH':
      switch (endpoint) {
        case '/':
          try {
            const profile = await Profile.findOneAndUpdate({ ...authQuery }, req.body, { new: true });
            if (!profile) return notFoundHandler(res, { label: 'Profile not found...' });
            res.status(200).json({ success: true, data: profile });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
