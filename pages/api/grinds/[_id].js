import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const grind = await Grind.findById(_id);
        if (!grind) {
          return res.status(400).json({ success: false, error: `Grind with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data: grind });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const grind = await Grind.findByIdAndUpdate(_id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!grind) {
          return res.status(400).json({ success: false, error: `Grind with id "${_id}" not found.` });
        }
        res.status(200).json({ success: true, data: grind });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedGrind = await Grind.deleteOne({ _id });
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
      const errorMessage = `Unhandled method: ${method}`;
      console.error(errorMessage);
      res.status(400).json({ success: false, error: errorMessage });
      break;
  }
}