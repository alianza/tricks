import dbConnect, { dbDisconnect } from '../../../lib/dbConnect';
import Profile from '../../../models/Profile';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const profiles = await Profile.find({}).lean();
        res.status(200).json({ success: true, data: profiles });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }

  await dbDisconnect();
}
