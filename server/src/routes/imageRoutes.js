import express from "express";
import Image from "../models/Image.js";
import Folder from "../models/Folder.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ✅ Upload image (name, image file, folderId)
router.post("/upload", auth, upload.single("image"), async (req, res, next) => {
  try {
    const { name, folderId } = req.body;
    if (!name || !folderId || !req.file) {
      return res
        .status(400)
        .json({ message: "name, folderId, and image are required" });
    }

    // Ensure folder belongs to user
    const folder = await Folder.findOne({ _id: folderId, owner: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Multer + Cloudinary returns req.file.path (URL) and req.file.filename (public_id)
    const image = await Image.create({
      name,
      url: req.file.path, // ✅ Cloudinary hosted URL
      publicId: req.file.filename, // ✅ Cloudinary public_id
      owner: req.user.id,
      folder: folder._id,
    });

    res.status(201).json(image);
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "Server error while uploading image" });
  }
});

// ✅ List images in a folder
router.get("/", auth, async (req, res, next) => {
  try {
    const { folderId } = req.query;
    if (!folderId) {
      return res.status(400).json({ message: "folderId required" });
    }

    const images = await Image.find({
      owner: req.user.id,
      folder: folderId,
    }).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    console.error("❌ Fetch Images Error:", error);
    res.status(500).json({ message: "Server error while fetching images" });
  }
});

// ✅ Search images by name
router.get("/search", auth, async (req, res, next) => {
  try {
    const { q = "" } = req.query;
    const regex = new RegExp(
      q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const images = await Image.find({
      owner: req.user.id,
      name: regex,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(images);
  } catch (error) {
    console.error("❌ Search Error:", error);
    res.status(500).json({ message: "Server error while searching images" });
  }
});

// ✅ Delete image (DB + Cloudinary)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const img = await Image.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!img) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(img.publicId);

    // Delete from DB
    await img.deleteOne();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ message: "Server error while deleting image" });
  }
});

export default router;
