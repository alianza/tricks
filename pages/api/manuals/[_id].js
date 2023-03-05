import dbConnect from '../../../lib/dbConnect';
import Manual from '../../../models/Manual';
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
        const manual = await Manual.findById(_id).lean();
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
        const manual = await Manual.findByIdAndUpdate(_id, req.body, {
          new: true,
          runValidators: true,
        });
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
        await checkForUsedCombos({ _id, trickType: 'Manual', res });
        const deletedManual = await Manual.deleteOne({ _id });
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
      const errorMessage = `Unhandled method: ${method}`;
      console.error(errorMessage);
      res.status(400).json({ success: false, error: errorMessage });
      break;
  }
}
