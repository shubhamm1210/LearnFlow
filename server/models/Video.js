const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    videoId: String,

    url: String,

    thumbnail: String,

    duration: Number,

    position: Number,

    topic: {
      type: String,
      default: "General",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);