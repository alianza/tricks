import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';
import { getFullGrindName } from '../../../lib/commonUtils';
import { checkForUsedCombos, requireAuth, notFoundHandler } from '../../../lib/serverUtils';
import { isValidObjectId } from 'mongoose';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  if (!isValidObjectId(_id)) return notFoundHandler(res, { entity: 'Grind', _id });

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const grind = await Grind.findOne({ _id, ...authQuery }).lean();
        if (!grind) return notFoundHandler(res, { entity: 'Grind', _id });
        const data = { ...grind, trick: getFullGrindName(grind) };
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const grind = await Grind.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true }).lean();
        if (!grind) return notFoundHandler(res, { entity: 'Grind', _id });
        const data = { ...grind, trick: getFullGrindName(grind) };
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        if (error.code === 11000) {
          error.message = 'This Grind already exists'; // Return code for unique index constraint violation
        }
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await checkForUsedCombos(_id, 'Grind');
        const deletedGrind = await Grind.deleteOne({ _id, ...authQuery });
        if (!deletedGrind) return notFoundHandler(res, { entity: 'Grind', _id });
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
