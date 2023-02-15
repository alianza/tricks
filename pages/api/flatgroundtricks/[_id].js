import dbConnect from '../../../lib/dbConnect';
import FlatGroundTrick from '../../../models/FlatgroundTrick';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const flatgroundTrick = await FlatGroundTrick.findById(_id);
        if (!flatgroundTrick) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: flatgroundTrick });
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
        if (!flatgroundTrick) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: flatgroundTrick });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedTrick = await FlatGroundTrick.deleteOne({ _id });
        if (!deletedTrick) {
          return res.status(400).json({ success: false });
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
