import dbConnect from '../../../lib/dbConnect';
import FlatGroundTrick from '../../../models/FlatgroundTrick';
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
        const flatgroundTrick = await FlatGroundTrick.findOne({ _id, ...authQuery }).lean();
        const data = { ...flatgroundTrick, trick: getFullGrindName(flatgroundTrick) };
        if (!flatgroundTrick) {
          return res.status(400).json({ success: false, error: `Flatground trick with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const flatgroundTrick = await FlatGroundTrick.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true });
        const data = { ...flatgroundTrick.toObject(), trick: getFullGrindName(flatgroundTrick) };
        if (!flatgroundTrick) {
          return res.status(400).json({ success: false, error: `Flatground trick with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await checkForUsedCombos(_id, 'Flatground Trick');
        const deletedTrick = await FlatGroundTrick.deleteOne({ _id, ...authQuery });
        if (!deletedTrick) {
          return res.status(400).json({ success: false, error: `Flatground trick with id "${_id}" not found.` });
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
