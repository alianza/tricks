import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const count = await Combo.estimatedDocumentCount();
        res.status(200).json({ success: true, data: { count } });
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
