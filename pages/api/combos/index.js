import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';

export default async function handler(req, res) {
  const { method } = req;

  console.log(`method`, method);

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const combo = await Combo.find({}).populate('trickArray.ref').lean();
        res.status(200).json({ success: true, data: combo });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        console.log(`req.body`, req.body);
        const combo = await Combo.create(req.body);
        res.status(201).json({ success: true, data: combo });
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