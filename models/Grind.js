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
      enum: { values: ['frontside', 'backside'], message: 'Provided direction is not a valid direction' },
      required: [true, "Please provide the tricks' direction"],
    },
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true }
);

GrindSchema.index({ userId: 1, name: 1, stance: 1, direction: 1 }, { unique: true });

export default mongoose.models.Grind || mongoose.model('Grind', GrindSchema);
