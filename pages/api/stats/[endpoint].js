import dbConnect from '../../../lib/dbConnect';
import Combo from '../../../models/Combo';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import Grind from '../../../models/Grind';
import Manual from '../../../models/Manual';

export default async function handler(req, res) {
  const {
    query: { endpoint },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      switch (endpoint) {
        case 'combos':
          try {
            const count = await Combo.estimatedDocumentCount();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'flatgroundtricks':
          try {
            const count = await FlatgroundTrick.estimatedDocumentCount();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'grinds':
          try {
            const count = await Grind.estimatedDocumentCount();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'manuals':
          try {
            const count = await Manual.estimatedDocumentCount();
            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        case 'users':
          try {
            const grindUserIds = await Grind.distinct('userId');
            const flatgroundTricksUserIds = await FlatgroundTrick.distinct('userId');
            const manualUserIds = await Manual.distinct('userId');
            const comboUserIds = await Combo.distinct('userId');

            const count = new Set([...grindUserIds, ...flatgroundTricksUserIds, ...manualUserIds, ...comboUserIds])
              .size;

            res.status(200).json({ success: true, data: { count } });
          } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, error: error.message });
          }
          break;
        default:
          res.status(400).json({ success: false, error: `Unhandled endpoint: ${endpoint}` });
          break;
      }
      break;
    default:
      res.status(400).json({ success: false, error: `Unhandled request method: ${method}` });
      break;
  }
}
