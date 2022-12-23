import dbConnect from "../../../lib/dbConnect";
import FlatgroundTrick from "../../../models/FlatgroundTrick";

export default async function handler(req, res) {
  const { method } = req;

  console.log(`method`, method);

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const flatgroundTrick = await FlatgroundTrick.find({}); /* find all the data in our database */
        res.status(200).json({ success: true, data: flatgroundTrick });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const flatgroundTrick = await FlatgroundTrick.create(req.body); /* create a new model in the database */
        console.log(`flatgroundTrick`, flatgroundTrick);
        res.status(201).json({ success: true, data: flatgroundTrick });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
