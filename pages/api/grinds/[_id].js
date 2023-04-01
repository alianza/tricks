import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';
import { getFullGrindName } from '../../../lib/util';
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
        const grind = await Grind.findOne({ _id, ...authQuery }).lean();
        const data = { ...grind, trick: getFullGrindName(grind) };
        if (!grind) {
          return res.status(400).json({ success: false, error: `Grind with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const grind = await Grind.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true });
        const data = {
          ...grind.toObject(),
          trick: getFullGrindName(grind),
        };
        if (!grind) {
          return res.status(400).json({ success: false, error: `Grind with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await checkForUsedCombos(_id, 'Grind');
        const deletedGrind = await Grind.deleteOne({ _id, ...authQuery });
        if (!deletedGrind) {
          return res.status(400).json({ success: false, error: `Grind with id "${_id}" not found.` });
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
