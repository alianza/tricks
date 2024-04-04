import mongoose from 'mongoose';
import { DEFAULT_PREFFERED_STANCE, PREFFERED_STANCES_ENUM } from './constants/stances';

const ProfileSchema = new mongoose.Schema(
  {
    preferred_stance: {
      type: String,
      enum: PREFFERED_STANCES_ENUM,
      default: DEFAULT_PREFFERED_STANCE,
    },
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true },
);

export default mongoose.models?.Profile || mongoose.model('Profile', ProfileSchema);
