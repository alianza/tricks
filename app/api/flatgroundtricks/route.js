import dbConnect from '@/lib/dbConnect';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import { getFullTrickName } from '@/lib/commonUtils';
import { appRequireAuth } from '@/lib/serverUtils';

async function handler(request) {
  const { method } = request;

  await dbConnect();
  const { authQuery } = await appRequireAuth();

  switch (method) {
    case 'GET':
      try {
        const flatgroundTricks = await FlatgroundTrick.find({ ...authQuery }).lean();
        const data = flatgroundTricks.map((flatgroundTrick) => ({
          ...flatgroundTrick,
          trick: getFullTrickName(flatgroundTrick),
        }));
        return Response.json({ success: true, data });
      } catch (error) {
        console.error(error);
        return Response.json({ success: false, error: error.message }, { status: 400 });
      }
    case 'POST':
      try {
        const data = await request.json();
        const flatgroundTrick = await FlatgroundTrick.create({ ...data, ...authQuery });
        return Response.json({ success: true, data: flatgroundTrick }, { status: 201 });
      } catch (error) {
        if (error.code === 11000) {
          error.message = 'This flatground trick already exists'; // Return code for unique index constraint violation
        }
        console.error(error);
        return Response.json({ success: false, error: error.message }, { status: 400 });
      }
    default:
      return Response.json({ success: false, error: `Unhandled request method: ${method}` }, { status: 400 });
  }
}

export { handler as GET, handler as POST };
