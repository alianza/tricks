import dbConnect from '../../../../lib/dbConnect';
import Combo from '../../../../models/Combo';
import { loginBarrier } from '../../utils';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();
  const { authQuery } = await loginBarrier(req, res, authOptions);

  switch (method) {
    case 'GET':
      try {
        const count = await Combo.find({ ...authQuery }).countDocuments();
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
