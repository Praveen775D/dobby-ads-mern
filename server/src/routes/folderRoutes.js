import express from 'express';
import Folder from '../models/Folder.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create folder (nested allowed)
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, parentId = null } = req.body;
    if (!name) return res.status(400).json({ message: 'name required' });
    let ancestors = [];
    if (parentId) {
      const parent = await Folder.findOne({ _id: parentId, owner: req.user.id });
      if (!parent) return res.status(404).json({ message: 'Parent not found' });
      ancestors = [ ...(parent.ancestors || []), parent._id ];
    }
    const folder = await Folder.create({ name, owner: req.user.id, parent: parentId, ancestors });
    res.status(201).json(folder);
  } catch (e) { next(e); }
});

// List child folders for a parent (or root when none)
router.get('/', auth, async (req, res, next) => {
  try {
    const { parentId = null } = req.query;
    const filter = { owner: req.user.id, parent: parentId || null };
    const folders = await Folder.find(filter).sort({ name: 1 });
    res.json(folders);
  } catch (e) { next(e); }
});

// Breadcrumb for a folder
router.get('/:id/breadcrumb', auth, async (req, res, next) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id });
    if (!folder) return res.status(404).json({ message: 'Not found' });
    const crumbs = await Folder.find({ _id: { $in: folder.ancestors } }).sort({ createdAt: 1 });
    res.json([ ...crumbs, folder ]);
  } catch (e) { next(e); }
});

export default router;
