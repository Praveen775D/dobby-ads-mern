import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    owner: { type: ObjectId, ref: 'User', required: true, index: true },
    folder: { type: ObjectId, ref: 'Folder', required: true, index: true }
  },
  { timestamps: true }
);

imageSchema.index({ owner: 1, name: 1 });

export default mongoose.model('Image', imageSchema);
