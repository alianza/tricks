import dbConnect from '../../../lib/dbConnect';
import Manual from '../../../models/Manual';
import { checkForUsedCombos, requireAuth, notFoundHandler } from '../../../lib/serverUtils';
import { isValidObjectId } from 'mongoose';

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  if (!isValidObjectId(_id)) return notFoundHandler(res, { entity: 'Manual', _id });

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      try {
        const manual = await Manual.findOne({ _id, ...authQuery }).lean();
        if (!manual) return notFoundHandler(res, { entity: 'Manual', _id });
        res.status(200).json({ success: true, data: manual });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PATCH':
      try {
        const manual = await Manual.findOneAndUpdate({ _id, ...authQuery }, req.body, { new: true });
        if (!manual) return notFoundHandler(res, { entity: 'Manual', _id });
        res.status(200).json({ success: true, data: manual });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        await checkForUsedCombos(_id, 'Manual');
        const deletedManual = await Manual.deleteOne({ _id, ...authQuery });
        if (!deletedManual) return notFoundHandler(res, { entity: 'Manual', _id });
        res.status(200).json({ success: true, data: {} });
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
