import dbConnect from '../../../lib/dbConnect';
import FlatGroundTrick from '../../../models/FlatgroundTrick';
import { getFullGrindName } from '../../../lib/util';
import { checkForUsedCombos } from '../utils';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const flatgroundTrick = await FlatGroundTrick.findById(_id).lean();
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
        const flatgroundTrick = await FlatGroundTrick.findByIdAndUpdate(_id, req.body, {
          new: true,
          runValidators: true,
        });
        const data = {
          ...flatgroundTrick.toObject(),
          trick: getFullGrindName(flatgroundTrick),
        };
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
        await checkForUsedCombos({ _id, trickType: 'Flatground Trick', res });
        const deletedTrick = await FlatGroundTrick.deleteOne({ _id });
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
      const errorMessage = `Unhandled method: ${method}`;
      console.error(errorMessage);
      res.status(400).json({ success: false, error: errorMessage });
      break;
  }
}
