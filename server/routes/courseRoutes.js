
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  importPlaylist,
  getMyCourses,
  getSingleCourse,toggleVideoComplete
} = require("../controllers/courseController");

router.post("/import", protect, importPlaylist);

router.get("/", protect, getMyCourses);

router.get("/:id", protect, getSingleCourse);
router.put(
  "/:courseId/video/:videoId",
  protect,
  toggleVideoComplete
);

module.exports = router;