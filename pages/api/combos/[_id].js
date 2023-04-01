import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';
import { populateComboTrickName } from '../../../lib/util';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const combo = await Combo.findById(_id).populate('trickArray.trick').lean();
        const data = populateComboTrickName(combo);
        if (!combo) {
          return res.status(400).json({ success: false, error: `Combo with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const combo = await Combo.findByIdAndUpdate(_id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!combo) {
          return res.status(400).json({ success: false, error: `Combo with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data: combo });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedCombo = await Combo.deleteOne({ _id });
        if (!deletedCombo) {
          return res.status(400).json({ success: false, error: `Combo with id "${_id}" not found.` });
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
