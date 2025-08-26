// routes/searchRoutes.js
import { Router } from "express";

const router = Router();

// simple placeholder search route
router.get("/", (req, res) => {
  res.json({ success: true, message: "Search route working 🚀" });
});

export default router;
