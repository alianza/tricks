import dbConnect from '../../../../lib/dbConnect';
import Combo from '../../../../models/Combo';
import { authOptions } from '../../auth/[...nextauth]';
import { populateComboName, populateComboTrickName } from '../../../../lib/commonUtils';
import { requireAuth } from '../../../../lib/serverUtils';
import Manual from '../../../../models/Manual';
import Grind from '../../../../models/Grind';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res, authOptions);

  switch (method) {
    case 'POST':
      const { body } = req;
      try {
        const query = { ...authQuery };

        if (body.grind) {
          query['trickArray.trickRef'] = Grind.modelName;
        }

        if (body.manual) {
          query['trickArray.trickRef'] = query['trickArray.trickRef']
            ? { $all: [query['trickArray.trickRef'], Manual.modelName] }
            : Manual.modelName;
        }

        let combos = await Combo.find(query).populate('trickArray.trick').lean();
        if (body.stance !== 'all') {
          combos = combos.filter(({ trickArray }) => trickArray[0].trick.stance === body.stance);
        }
        combos = combos.map(populateComboTrickName); // Populate every trick name in the combo
        combos = combos.map(populateComboName); // Populate every combo name
        res.status(200).json({ success: true, data: combos });
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
