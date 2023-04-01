import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const count = await Grind.estimatedDocumentCount();
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
