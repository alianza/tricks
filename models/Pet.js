import mongoose from "mongoose";

/* PetSchema will correspond to a collection in your MongoDB database. */
const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this pet."],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    owner_name: {
      type: String,
      required: [true, "Please provide the pet owner's name"],
      maxlength: [60, "Owner's Name cannot be more than 60 characters"],
    },
    species: {
      type: String,
      required: [true, "Please specify the species of your pet."],
      maxlength: [40, "Species specified cannot be more than 40 characters"],
    },
    birthdate: { type: Date, required: [true, "Please provide a birthdate for this pet."] },
    potty_trained: { type: Boolean },
    diet: { type: Array },
    image_url: { required: [true, "Please provide an image url for this pet."], type: String },
    likes: { type: Array },
    dislikes: { type: Array },
  },
  { timestamps: true }
);

export default mongoose.models.Pet || mongoose.model("Pet", PetSchema);
