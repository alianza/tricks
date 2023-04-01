import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { populateComboName, populateComboTrickName } from '../../../lib/util';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const authQuery = { userId: session.user.id };

  switch (method) {
    case 'GET':
      try {
        let combos = await Combo.find({ ...authQuery })
          .populate('trickArray.trick')
          .lean();
        combos = combos.map(populateComboTrickName); // Populate every trick name in the combo
        combos = combos.map(populateComboName); // Populate every combo name
        res.status(200).json({ success: true, data: combos });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST':
      try {
        const combo = await Combo.create({ ...req.body, ...authQuery });
        res.status(201).json({ success: true, data: combo });
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
