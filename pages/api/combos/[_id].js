import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';
import { populateComboTrickName } from '../../../lib/commonUtils';
import { requireAuth, notFoundHandler } from '../../../lib/serverUtils';
import { isValidObjectId } from 'mongoose';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  if (!isValidObjectId(_id)) return notFoundHandler(res, { entity: 'Combo', _id });

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const combo = await Combo.findOne({ _id, ...authQuery })
          .populate('trickArray.trick')
          .lean();
        if (!combo) return notFoundHandler(res, { entity: 'Combo', _id });
        const data = populateComboTrickName(combo);
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const combo = await Combo.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true }).lean();
        if (!combo) return notFoundHandler(res, { entity: 'Combo', _id });
        res.status(200).json({ success: true, data: combo });
      } catch (error) {
        console.error(error);
        if (error.code === 11000) {
          error.message = 'This Combo already exists'; // Return code for unique index constraint violation
        }
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedCombo = await Combo.deleteOne({ _id, ...authQuery });
        if (!deletedCombo) return notFoundHandler(res, { entity: 'Combo', _id });
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
