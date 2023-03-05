import mongoose from 'mongoose';
import { MANUALS_ENUM } from './constants/manuals';

const ManualSchema = new mongoose.Schema(
  {
    preferred_stance: {
      type: String,
      required: [true, 'Please provide your preferred stance'],
      enum: ['regular', 'goofy'],
    },
    type: {
      type: String,
      required: [true, 'Please provide the type of manual'],
      enum: MANUALS_ENUM,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Manual || mongoose.model('Manual', ManualSchema);
