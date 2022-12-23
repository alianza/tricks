import mongoose from "mongoose";

const FlatGroundTrickSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this trick"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    preferred_stance: {
      type: String,
      required: [true, "Please provide your preferred stance"],
      enum: ["regular", "goofy"],
    },
    stance: {
      type: String,
      required: [true, "Please provide the tricks' stance"],
      enum: ["regular", "fakie", "switch", "nollie"],
    },
    direction: { type: String, enum: ["none", "frontside", "backside"] },
    date: { type: Date, default: Date.now },
    link: {
      type: String,
      required: [true, "Please provide an image/video url for this trick"],
    },
    image_url: { type: String },
    description: {
      type: String,
      maxlength: [250, "Description cannot be more than 250 characters"],
    },
    location: { longitude: { type: Number }, latitude: { type: Number } },
    landed: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FlatGroundTrick ||
  mongoose.model("FlatGroundTrick", FlatGroundTrickSchema);
