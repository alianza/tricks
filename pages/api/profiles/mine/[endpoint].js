import dbConnect from '../../../../lib/dbConnect';
import { ensureProfile, requireAuth } from '../../../../lib/serverUtils';

export default async function handler(req, res) {
  const {
    query: { endpoint },
    method,
  } = req;

  await dbConnect();
  const { authQuery } = await requireAuth(req, res);

  switch (method) {
    case 'GET':
      switch (endpoint) {
        case 'preferred_stance':
          try {
            const { preferred_stance } = await ensureProfile({ ...authQuery });
            res.status(200).json({ success: true, data: { preferred_stance } });
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
