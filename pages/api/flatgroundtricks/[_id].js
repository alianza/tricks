import dbConnect from "../../../lib/dbConnect";
import FlatGroundTrick from "../../../models/FlatgroundTrick";

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const flatGroundTrick = await FlatGroundTrick.findById(_id);
        if (!flatGroundTrick) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: flatGroundTrick });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const flatGroundTrick = await FlatGroundTrick.findByIdAndUpdate(_id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!flatGroundTrick) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: flatGroundTrick });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedTrick = await FlatGroundTrick.deleteOne({ _id });
        if (!deletedTrick) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
