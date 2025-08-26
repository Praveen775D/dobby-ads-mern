import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: ObjectId, ref: 'User', required: true, index: true },
    parent: { type: ObjectId, ref: 'Folder', default: null, index: true },
    ancestors: [{ type: ObjectId, ref: 'Folder', index: true }]
  },
  { timestamps: true }
);

folderSchema.index({ owner: 1, parent: 1, name: 1 }, { unique: true });

export default mongoose.model('Folder', folderSchema);
