import dbConnect from '@/lib/dbConnect';
import FlatgroundTrick from '../../../models/FlatgroundTrick';
import { getFullTrickName } from '@/lib/commonUtils';
import { appRequireAuth } from '@/lib/serverUtils';

export async function GET(request) {
  await dbConnect();
  const { authQuery } = await appRequireAuth();

  try {
    const flatgroundTricks = await FlatgroundTrick.find({ ...authQuery }).lean();
    const data = flatgroundTricks.map(({ _id, ...flatgroundTrick }) => ({
      ...flatgroundTrick,
      trick: getFullTrickName(flatgroundTrick),
      id: _id.toString(),
    }));
    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  const { authQuery } = await appRequireAuth();

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
}
