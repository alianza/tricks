import dbConnect from '../../../lib/dbConnect';
import Manual from '../../../models/Manual';
import { checkForUsedCombos, loginBarrier } from '../utils';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await dbConnect();
  const { authQuery } = await loginBarrier(req, res, authOptions);

  switch (method) {
    case 'GET':
      try {
        const manual = await Manual.findOne({ _id, ...authQuery }).lean();
        if (!manual) {
          return res.status(400).json({ success: false, error: `Manual with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data: manual });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const manual = await Manual.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true });
        if (!manual) {
          return res.status(400).json({ success: false, error: `Manual with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data: manual });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await checkForUsedCombos(_id, 'Manual');
        const deletedManual = await Manual.deleteOne({ _id, ...authQuery });
        if (!deletedManual) {
          return res.status(400).json({ success: false, error: `Manual with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data: {} });
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
