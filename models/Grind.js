import mongoose from 'mongoose';
import { GRINDS_ENUM } from './constants/grinds';

const GrindSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this trick'],
      enum: GRINDS_ENUM,
      // enum: { values: FLATGROUND_TRICKS, message: 'Provided name is not a valid trick name' }, // custom error message
    },
    preferred_stance: {
      type: String,
      required: [true, 'Please provide your preferred stance'],
      enum: ['regular', 'goofy'],
    },
    stance: {
      type: String,
      required: [true, "Please provide the tricks' stance"],
      enum: ['regular', 'fakie', 'switch', 'nollie'],
    },
    direction: {
      type: String,
      enum: ['none', 'frontside', 'backside'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Grind || mongoose.model('Grind', GrindSchema);
