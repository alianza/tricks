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
      enum: ["Regular", "Goofy"],
    },
    stance: {
      type: String,
      required: [true, "Please provide the tricks' stance"],
      enum: ["Regular", "Fakie", "Switch", "Nollie"],
    },
    direction: {
      type: String,
      required: [false, "Please specify the direction of your trick"],
      enum: ["Frontside", "Backside"],
    },
    date: { type: Date, default: Date.now },
    link: {
      type: String,
      required: [true, "Please provide an image/video url for this trick"],
    },
    description: {
      type: String,
      maxlength: [250, "Description cannot be more than 250 characters"],
    },
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.models.FlatGroundTrick || mongoose.model("FlatGroundTrick", FlatGroundTrickSchema);
