import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    preferred_stance: {
      type: String,
      enum: ['regular', 'goofy'],
      default: 'regular',
    },
    userId: {
      type: Number,
      required: [true, 'Authentication error. Please log in again.'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
