import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';
import { populateComboName, populateComboTrickName } from '../../../lib/commonUtils';
import { requireAuth } from '../../../lib/serverUtils';
import Grind from '../../../models/Grind';
import Manual from '../../../models/Manual';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const where = { ...authQuery };

        if (query.grind === 'true') {
          where['trickArray.trickRef'] = Grind.modelName;
        }

        if (query.manual === 'true') {
          where['trickArray.trickRef'] = where['trickArray.trickRef']
            ? { $all: [where['trickArray.trickRef'], Manual.modelName] }
            : Manual.modelName;
        }

        if (query.landed && query.landed !== 'any') {
          where.landed = query.landed === 'true' ? true : { $ne: true }; // If landed is true, set landed to true, otherwise set landed to not true (if landed is false or undefined)
        }

        if (query.countOnly === 'true') {
          const count = await Combo.countDocuments(where);
          return res.status(200).json({ success: true, data: count });
        }

        let combos = await Combo.find(where).populate('trickArray.trick').lean();

        if (query.stance && query.stance !== 'all') {
          combos = combos.filter(({ trickArray }) => trickArray[0].trick.stance === query.stance); // Filter after populating trickArray.trick to get the populated stance
        }

        combos = combos.map(populateComboTrickName);
        combos = combos.map(populateComboName);
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
        if (error.code === 11000) {
          error.message = 'This Combo already exists'; // Return code for unique index constraint violation
        }
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
