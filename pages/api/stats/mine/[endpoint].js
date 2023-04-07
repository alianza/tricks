import dbConnect from '../../../../lib/dbConnect';
import Combo from '../../../../models/Combo';
import FlatgroundTrick from '../../../../models/FlatgroundTrick';
import Grind from '../../../../models/Grind';
import Manual from '../../../../models/Manual';
import { loginBarrier } from '../../../../lib/serverUtils';
import { authOptions } from '../../auth/[...nextauth]';

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
        case 'combos':
          try {
            const count = await Combo.find({ ...authQuery }).countDocuments();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'flatgroundtricks':
          try {
            const count = await FlatgroundTrick.find({ ...authQuery }).countDocuments();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'grinds':
          try {
            const count = await Grind.find({ ...authQuery }).countDocuments();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'manuals':
          try {
            const count = await Manual.find({ ...authQuery }).countDocuments();
            res.status(200).json({ success: true, data: { count } });
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
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
