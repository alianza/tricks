import dbConnect from '../../../lib/dbConnect';
import Grind from '../../../models/Grind';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const grind = await Grind.find({});
        res.status(200).json({ success: true, data: grind });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const grind = await Grind.create(req.body);
        res.status(201).json({ success: true, data: grind });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
