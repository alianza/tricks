import dbConnect from '../../../lib/dbConnect';
import FlatGroundTrick from '../../../models/FlatgroundTrick';
import { getFullTrickName } from '../../../lib/commonUtils';
import { checkForUsedCombos, requireAuth, notFoundHandler } from '../../../lib/serverUtils';
import { isValidObjectId } from 'mongoose';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  if (!isValidObjectId(_id)) return notFoundHandler(res, { entity: 'Flatground trick', _id });

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const flatgroundTrick = await FlatGroundTrick.findOne({ _id, ...authQuery }).lean();
        if (!flatgroundTrick) return notFoundHandler(res, { entity: 'Flatground trick', _id });
        const data = { ...flatgroundTrick, trick: getFullTrickName(flatgroundTrick) };
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const flatgroundTrick = await FlatGroundTrick.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true });
        if (!flatgroundTrick) return notFoundHandler(res, { entity: 'Flatground trick', _id });
        const data = { ...flatgroundTrick.toObject(), trick: getFullTrickName(flatgroundTrick) };
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
        if (!deletedTrick) return notFoundHandler(res, { entity: 'Flatground trick', _id });
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
